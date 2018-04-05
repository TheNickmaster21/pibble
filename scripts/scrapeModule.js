function parseHtmlDataIntoTokenData($htmlData) {
    let tokens = [];

    function recurseThroughChildren(obj) {
        if (!obj) return;
        tokens.push({type: obj.localName});
        if(obj.innerText){
            obj.innerText //TODO turn inner text into tokens
        }
        if (!obj.children) return;
        _.each(obj.children, recurseThroughChildren);
    }

    $htmlData.children().each(function (i, obj) {
        recurseThroughChildren(obj);
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