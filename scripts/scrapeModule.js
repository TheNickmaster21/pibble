// Function to turn html data into a list of tokens
function parseHtmlDataIntoTokenData($htmlData) {
    let tokens = [];
    // Track where we are in the html
    let elementStack = [];

    // Make a token from the object
    function tokenize(obj) {
        // If the object has no text, only whitespace, or is super long, we don't want it
        if (!obj.innerText || obj.innerText.trim() === '' || obj.innerText.length > 100) {
            return;
        }
        // If the inner token has the same text as the outer token, we want the inner only
        if (tokens.length > 0 && obj.innerText === tokens[tokens.length - 1].innerText) {
            tokens.pop();
        }
        // Remove duplicate text (inner text of outer divs includes text of inner divs)
        let elements = elementStack.join(' ');
        let i = tokens.length - 1;
        let lastLength = 516000;
        while (i > 0) {
            if (elements.includes(tokens[i].elements)) {
                if (tokens[i].elements.length < lastLength) {
                    lastLength = tokens[i].elements.length;
                    tokens[i].innerText = tokens[i].innerText.replace(obj.innerText, '').trim();
                    if (tokens[i].innerText.length === 0 && tokens[i].elements.length) {
                        tokens.splice(i, 1);
                    }
                }
            }
            i--;
        }
        // Create the actual token
        tokens.push({
            id: obj.id,
            elements: elements,
            className: obj.className,
            innerText: obj.innerText.trim(),
            obj: obj
        });
    }

    // Recursively search all the children of each element and track the element(s)
    function recurseThroughChildren(obj) {
        if (!obj || obj.hidden || obj.localName === 'script') return;
        elementStack.push(obj.localName);
        tokenize(obj);
        if (obj.children) {
            _.each(obj.children, recurseThroughChildren);
        }
        elementStack.pop();
    }

    // Iterate through all of the jQuery objects of the document
    $htmlData.children().each(function (i, obj) {
        recurseThroughChildren(obj);
    });
    // Give ids to all of the tokens
    for (let i = 0; i < tokens.length; i++) {
        tokens[i].index = i;
    }
    return tokens;
}

// Send even to get html and run the function to parse it
function getTokensFromCurrentPage(callback) {

    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            let $htmlData = $(innerHTML);
            let results = parseHtmlDataIntoTokenData($htmlData);
            callback(results);
        }
    );

    return true;
}

// Function to scrape data from the set of tokens with the given rule
function scrapeDataWithRule(rule, tokens) {
    // Function to set the confidence that the given token matches the given rule
    function setConfidence(token) {
        token.confidence = 0;

        let prevToken = token.before;
        let nextToken = token.after;
        // This allows an element with only some matching classes to partially match
        let classConfidence = 0;
        for (let i = 0; i < rule.classes.length; i++) {
            classConfidence += _.contains(token.className.split(' '), rule.classes[i]) * (1 / rule.classes.length);
        }
        // These values can be tweaked over time. This would be a good thing to do machine learning on
        if (token.id === rule.id)
            token.confidence += 0.25;
        if (token.elements === rule.elements)
            token.confidence += 0.25;
        if (classConfidence)
            token.confidence += classConfidence * .2;
        if (prevToken && rule.before && prevToken.elements === rule.before.elements)
            token.confidence += 0.1;
        if (prevToken && rule.before && prevToken.innerText === rule.before.innerText)
            token.confidence += 0.05;
        if (nextToken && rule.after && nextToken.elements === rule.after.elements)
            token.confidence += 0.1;
        if (nextToken && rule.after && nextToken.innerText === rule.after.innerText)
            token.confidence += 0.05;
    }

    // Set the confidence on all of the tokens
    for (let i = 0; i < tokens.length; i++) {
        setConfidence(tokens[i]);
    }

    let result = false;
    let sortedTokens = _.sortBy(tokens, token => -token.confidence);
    // Is the highest confidence safe enough to trust it is the correct token?
    if (sortedTokens[0].confidence > .75) {
        result = sortedTokens[0].innerText;
    }
    // Remove the confidence so tokens can be used elsewhere
    _.each(tokens, token => delete token.confidence);
    // Return the matching text or empty string
    return result;
}

// Scrape the given tokens with the given rule set
function scrapeDataFromTokens(ruleSet, tokens) {
    let results = [];
    // Add some extra metadata to the tokens to make this easier
    setBeforeAndAfterOnTokens(tokens);
    // Iterate through all rules and add the scraped data
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        let result = scrapeDataWithRule(rule, tokens);
        results.push(result);
    }
    return results;
}

// Given a ruleSet, get the website tokens and scrape them
function scrapeFromCurrentWebPage(ruleSet, callback) {
    if (!ruleSet || !ruleSet.rules) {
        return false;
    }

    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            let $htmlData = $(innerHTML);
            let tokens = parseHtmlDataIntoTokenData($htmlData);
            let results = scrapeDataFromTokens(ruleSet, tokens);
            callback(results);
        }
    );

    return true;
}

// Listen for chrome events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_tokens') {
        return getTokensFromCurrentPage(callback);
    } else if (message.action === 'scrape_web_page') {
        return scrapeFromCurrentWebPage(message.data, callback);
    }
});
