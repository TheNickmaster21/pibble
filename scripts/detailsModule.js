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
    for(let i = 0; i < ruleSets.length; i++){
        if(ruleSets[i].new){
            ruleSets[i] = convertNewRuleSet(ruleSets[i], message.data.tokens);
        }
    }

    saveData('ruleSets', ruleSets);
}