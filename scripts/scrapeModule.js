let lastActiveTab = null;

setInterval(function () {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        if (tabs && tabs[0]) {
            lastActiveTab = tabs[0];
        }
    });
}, 500);

function sendQueryMessageToActiveTabWithCallback(message, callback) {
    if (lastActiveTab) {
        chrome.tabs.sendMessage(lastActiveTab.id, message, callback);
    }
}

function getTextFromSelector($htmlData, selector, index) {
    let elements = $htmlData.find(selector);
    if (!elements || !elements[index]) {
        return "";
    }
    return elements[index].textContent;
}

function getSubstringFromRawValue(value, substringArray) {
    return value.substring(substringArray[0], substringArray[1])
}

function getTextFromRegex(value, expression, index) {
    let groups = value.match(new RegExp(expression, "g"));
    if (!groups || !groups[index]) {
        return "";
    }
    return groups[index];
}

function getDataFromNodesWithRule($htmlData, rule) {
    let result = getTextFromSelector($htmlData, rule.selector, rule.selectorIndex);
    if (result && rule.substring) {
        result = getSubstringFromRawValue(result, rule.substring);
    }
    if (result && rule.regex) {
        result = getTextFromRegex(result, rule.regex, rule.regexIndex);
    }
    return result;
}

function useRuleSetToScrapeFromJQueryNodes(ruleSet, $htmlData) {
    let results = [];
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        results.push(getDataFromNodesWithRule($htmlData, rule))
    }
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