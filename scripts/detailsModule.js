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
    saveData('ruleSets', message.data);
}