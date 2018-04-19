function parseHtmlDataIntoTokenData($htmlData) {
    let tokens = [];
    tokens.push({type: 'start'});

    let elementStack = [];

    // function makeAttributeObject(attributeNodes) {
    //     if (!attributeNodes || attributeNodes.length < 1) return null;
    //
    //     return _.map(attributeNodes,
    //         node => {
    //             return {name: node.name, value: node.value};
    //         });
    // }

    //TODO Better way to parse text
    // function parseTextTokens(text) {
    //     let tokens = [];
    //     let current = '';
    //     for (let i = 0; i < text.length; i++) {
    //         current = current + text[i];
    //     }
    //     return tokens;
    // }

    function tokenize(obj) {
        if (!obj.innerText || obj.innerText.trim() === '') {
            return;
        }
        if (obj.innerText === tokens[tokens.length - 1].innerText) {
            tokens.pop();
        }
        let elements = elementStack.join(' ');
        let i = tokens.length - 1;
        while (i > 0) {
            if (elements.includes(tokens[i].elements)) {
                tokens[i].innerText = tokens[i].innerText.replace(obj.innerText, '').trim();
                if (tokens[i].innerText.length === 0) {
                    tokens.splice(i, 1);
                }
            }
            i--;
        }
        tokens.push({
            elements: elements,
            //attributes: makeAttributeObject(obj.attributes),
            className: obj.className,
            innerText: obj.innerText.trim(),
            obj: obj
            //textTokens: parseTextTokens(obj.innerText.trim())
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
        tokens[i].id = i;
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
        let before = prevToken && prevToken.elements === rule.elements.before;
        let at = token.elements === rule.elements.at;
        let after = nextToken && nextToken.elements === rule.elements.after;
        let classes = token.className === rule.className;

        if (at)
            token.confidence += 0.4;
        if (classes)
            token.confidence += 0.35;
        if (before)
            token.confidence += 0.125;
        if (after)
            token.confidence += 0.125;
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