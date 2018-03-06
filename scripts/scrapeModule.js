function sendQueryMessageToActiveTabWithCallback(message, callback) {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        let activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, message, callback);
        }
    });
}

function getDataFromNodesWithRule($htmlData, rule) {

}

function useRuleSetToScrapeFromJQueryNodes(ruleSet, $htmlData) {
    let results = [];
    debugger;//$htmlData.find("td[data-reactid|='Profit']")
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        results.push(getDataFromNodesWithRule($htmlData, rule))
    }
    return results;
}

function scrapeDataFromCurrentPage(ruleSet, callback) {
    if (!ruleSet || !ruleSet.rules) {
        return false;
    }

    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            let $htmlData = $(innerHTML);
            let results = useRuleSetToScrapeFromJQueryNodes(ruleSet, $htmlData);
            callback(results);
        }
    );

    return true;
}

chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'scrape_web_page') {
        scrapeDataFromCurrentPage(message.data, callback);
    }
});