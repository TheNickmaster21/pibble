// Get the text content from the element at the index of the selector result
function getTextFromSelector($htmlData, selector, index) {
    // Get all elements that match the given jQuery selector
    let elements = $htmlData.find(selector);
    // If there are no results or the wanted index is empty, return nothing
    if (!elements || !elements[index]) {
        return "";
    }
    return elements[index].textContent;
}

// Get a substring of the value given a value of indexes
function getSubstringFromRawValue(value, substringArray) {
    return value.substring(substringArray[0], substringArray[1])
}

// Get the text at the given index from evaluating regex on the given string
function getTextFromRegex(value, expression, index) {
    let groups = value.match(new RegExp(expression, "g"));
    if (!groups || !groups[index]) {
        return "";
    }
    return groups[index];
}

// Given the web page and a rule, scrape out text data
function getDataFromNodesWithRule($htmlData, rule) {
    // First get text from the jQuery selector
    let result = getTextFromSelector($htmlData, rule.selector, rule.selectorIndex);
    // If we need a substring, get it
    if (result && rule.substring) {
        result = getSubstringFromRawValue(result, rule.substring);
    }
    // If we need to run regex, run it
    if (result && rule.regex) {
        result = getTextFromRegex(result, rule.regex, rule.regexIndex);
    }
    return result;
}

// Given a rule set and html, extract data using the rules
function useRuleSetToScrapeFromJQueryNodes(ruleSet, $htmlData) {
    let results = [];
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        results.push(getDataFromNodesWithRule($htmlData, rule))
    }
    return results;
}

// Scrape data by calling the callback function with the given rule set
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

// Listen for events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'labrador_scrape_web_page') {
        return scrapeDataFromCurrentPage(message.data, callback);
    }
});