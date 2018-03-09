var lastActiveTab = null;

setInterval(function () {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        lastActiveTab = tabs[0];
    });
}, 500);

function sendQueryMessageToActiveTabWithCallback(message, callback) {
    if (lastActiveTab) {
        chrome.tabs.sendMessage(lastActiveTab.id, message, callback);
    }
}

function getDataFromNodesWithRule($htmlData, rule) {
    let elements = $htmlData.find(rule.selector);
    if (!elements || elements.length === 0) {
        return "";
    }
    let rawValue = elements[rule.selectorIndex];
    if (!rawValue) {
        return "";
    }
    if (rule.regex) {
        let groups = rawValue.textContent.match(new RegExp(rule.regex, "g")); //This magic might now work
        if (!groups || !groups[rule.regexIndex]) {
            return "";
        }
        return groups[rule.regexIndex];
    } else {
        return rawValue.textContent;
    }
}

function useRuleSetToScrapeFromJQueryNodes(ruleSet, $htmlData) {
    let results = [];
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        results.push(getDataFromNodesWithRule($htmlData, rule))
    }
    console.log(results);
    return results;
}

function scrapeDataFromCurrentPage(ruleSet, callback) {
    if (!ruleSet || !ruleSet.rules) {
        console.warn("Bad rule set: ", ruleSet);
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
        return scrapeDataFromCurrentPage(message.data, callback);
    }
});