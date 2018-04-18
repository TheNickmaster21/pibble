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
            id: tokens.length,
            elements: elements,
            //attributes: makeAttributeObject(obj.attributes),
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
    return tokens;
}

function getTokensFromCurrentPage(callback) {

    sendQueryMessageToActiveTabWithCallback(
        'get_current_document_inner_HTML',
        function (innerHTML) {
            let $htmlData = $(innerHTML);
            let results = parseHtmlDataIntoTokenData($htmlData);
            console.log(results);
            callback(results);
        }
    );

    return true;
}

chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_tokens') {
        return getTokensFromCurrentPage(callback);
    }
});