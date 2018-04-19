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

function nextOffset(o) {
    if (o > 0) {
        return -1 * o;
    } else {
        return (-1 * o) + 1
    }
}

function scrapeDataWithRule(rule, tokens, attempt) {
    let o = 0;
    while (o > -1 * tokens.length && o < tokens.length) {
        let i = rule.expectedIndex + o;
        if (i > 0 && i < tokens.length - 1) {
            let prevToken = tokens[i - 1];
            let token = tokens[i];
            let nextToken = tokens[i + 1];
            let before = prevToken.elements === rule.elements.before;
            let at = token.elements === rule.elements.at;
            let after = nextToken.elements === rule.elements.after;
            let classes = token.className === rule.className;
            if (attempt === 1 && (before && at && after && classes)
                || attempt === 2 && ((before || after) && at && classes)
                || attempt === 3 && (((before && after) || classes) && at)) {
                return token.innerText;
            }
        }
        o = nextOffset(o);
    }
    return false;
}

function scrapeDataFromTokens(ruleSet, tokens) {
    let results = [];
    for (let i = 0; i < ruleSet.rules.length; i++) {
        let rule = ruleSet.rules[i];
        let result = scrapeDataWithRule(rule, tokens, 1);
        if (!result)
            result = scrapeDataWithRule(rule, tokens, 2);
        if (!result)
            result = scrapeDataWithRule(rule, tokens, 3);
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