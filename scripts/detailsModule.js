chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_rule_sets') {
        returnRuleSets(message, callback);
    } else if (message.action === 'save_rule_sets') {
        saveRuleSets(message);
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
            saveData('dataSet_' + ruleSets[i].id, ruleSets); //Super simple, 1 to 1 w/ rule sets
        }
    }
    saveData('ruleSets', ruleSets);
}