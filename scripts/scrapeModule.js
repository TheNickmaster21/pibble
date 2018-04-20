function parseHtmlDataIntoTokenData($htmlData) {
    let tokens = [];
    tokens.push({type: 'start'});

    let elementStack = [];

    function tokenize(obj) {
        if (!obj.innerText || obj.innerText.trim() === '' || obj.innerText.length > 100) {
            return;
        }
        if (obj.innerText === tokens[tokens.length - 1].innerText) {
            tokens.pop();
        }
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
        tokens.push({
            id: obj.id,
            elements: elements,
            className: obj.className,
            innerText: obj.innerText.trim(),
            obj: obj
        });
    }

    function recurseThroughChildren(obj) {
        if (!obj || obj.hidden || obj.localName === 'script') return;
        elementStack.push(obj.localName);
        tokenize(obj);
        if (obj.children) {
            _.each(obj.children, recurseThroughChildren);
        }
        elementStack.pop();
    }

    $htmlData.children().each(function (i, obj) {
        recurseThroughChildren(obj);
    });

    tokens.splice(0, 1); // Remove start token
    for (let i = 0; i < tokens.length; i++) {
        tokens[i].index = i;
    }
    return tokens;
}

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

function scrapeDataWithRule(rule, tokens) {
    function setConfidence(token) {
        token.confidence = 0;

        let prevToken = token.before;
        let nextToken = token.after;

        let classConfidence = 0;
        for (let i = 0; i < rule.classes.length; i++) {
            classConfidence += _.contains(token.className.split(' '), rule.classes[i]) * (1 / rule.classes.length);
        }

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

    for (let i = 0; i < tokens.length; i++) {
        setConfidence(tokens[i]);
    }

    let result = false;
    let sortedTokens = _.sortBy(tokens, token => -token.confidence);

    if (sortedTokens[0].confidence > .75) {
        result = sortedTokens[0].innerText;
    }

    _.each(tokens, token => delete token.confidence);
    return result;
}

function scrapeDataFromTokens(ruleSet, tokens) {
    let results = [];
    setBeforeAndAfterOnTokens(tokens);
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        let result = scrapeDataWithRule(rule, tokens);
        results.push(result);
    }
    return results;
}

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

chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_tokens') {
        return getTokensFromCurrentPage(callback);
    } else if (message.action === 'scrape_web_page') {
        return scrapeFromCurrentWebPage(message.data, callback);
    }
});
