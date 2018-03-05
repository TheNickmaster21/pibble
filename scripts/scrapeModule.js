function sendQueryMessageToActiveTabWithCallback(message, callback) {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        let activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, message, callback);
        }
    });
}

function getDataFromNodesWithRule(nodes, rule) {

}

function useRuleSetToScrapeFromJQueryNodes(ruleSet, nodes) {
    let results = [];
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        results.push(getDataFromNodesWithRule(nodes, rule))
    }
    return results;
}

function scrapeDataFromCurrentPage(ruleSet) {
    //todo validate ruleSet

    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            let nodes = $.parseHTML(innerHTML);
            let results = useRuleSetToScrapeFromJQueryNodes(ruleSet, nodes);
            //todo do something with the results
        }
    );
}

setInterval(function () {
    scrapeDataFromCurrentPage({});
}, 1000);