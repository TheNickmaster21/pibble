chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_rule_sets') {
        returnRuleSets(message, callback);
    } else if (message.action === 'save_rule_sets') {
        saveRuleSets(message);
    } else if (message.action === 'add_row_to_data_set') {
        console.log(message);
        addDataRow(message);
    }
});

function returnRuleSets(message, callback) {
    let data = loadData('ruleSets');
    if (data)
        callback(data);
    else
        callback([]);
}

function saveRuleSets(message) {
    let ruleSets = message.data.ruleSets;
    for (let i = 0; i < ruleSets.length; i++) {
        if (ruleSets[i].isNew) {
            ruleSets[i].id = ruleSets.length;
            ruleSets[i] = convertNewRuleSet(ruleSets[i], message.data.tokens);
            saveData('dataSet_' + ruleSets[i].id, []); //Super simple, 1 to 1 w/ rule sets
        }
    }
    saveData('ruleSets', ruleSets);
}

function addDataRow(message) {
    let id = message.id;
    if (typeof id === 'undefined')
        return;

    let ruleSets = loadData('ruleSets') || [];
    let ruleSet = _.findWhere(ruleSets, {id: id});
    if (!ruleSet)
        return;

    let newRow = message.row;
    let rows = loadData('dataSet_' + id) || [];
    let valid = true;
    _.each(rows, function (exitingRow) {
        for (let i = 0; i < ruleSet.rules.length; i++) {
            if (ruleSet.rules[i].unique && exitingRow[i] === newRow[i]) {
                valid = false;
            }
        }
    });
    if (valid) {
        rows.push(newRow);
        saveData('dataSet_' + id, rows);
    }
}