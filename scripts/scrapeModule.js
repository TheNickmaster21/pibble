function parseHtmlDataIntoTokenData($htmlData) {
    let tokens = [];
    tokens.push({type: 'start'});

    function tokenizeText(text) {
        tokens.push({type: 'text', value: text})
    }

    function makeAttributeObject(attributeNodes) {
        if (!attributeNodes || attributeNodes.length < 1) return null;

        return _.map(attributeNodes,
            node => {
                return {name: node.name, value: node.value};
            });
    }

    function recurseThroughChildren(obj) {
        if (!obj) return;
        let lastToken = tokens[tokens.length - 1];
        if (lastToken.type !== obj.localName) {
            //tokens.push({type: obj.localName, attributes: makeAttributeObject(obj.attributes)});
        }
        if (obj.innerText) {
            tokenizeText(obj.innerText); //TODO turn inner text into tokens
        }
        if (!obj.children) return;
        _.each(obj.children, recurseThroughChildren);
    }

    $htmlData.children().each(function (i, obj) {
        recurseThroughChildren(obj);
        console.log(obj);
    });

    console.log(tokens);

    return $htmlData;
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

chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'get_tokens') {
        return getTokensFromCurrentPage(callback);
    }
});