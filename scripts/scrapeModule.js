function sendQueryMessageToActiveTabWithCallback(message, callback) {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        let activeTab = tabs[0];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, message, callback);
        }
    });
}

function useRuleSetToScrapeFromJQueryNodes(ruleSet, nodes) {
    console.log('Nodes: ' + nodes);
}

function scrapeDataFromCurrentPage(ruleSet) {
    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            console.log('Me got: ' + innerHTML);
            let nodes = $.parseHTML(innerHTML);
            useRuleSetToScrapeFromJQueryNodes(ruleSet, nodes);
        }
    );
}

setInterval(function () {
    console.log("wat");
    scrapeDataFromCurrentPage({});
}, 1000);