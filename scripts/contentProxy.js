function getCurrentDocumentInnerHTML(responseFunction) {
    let innerHTML = document.documentElement.innerHTML;
    responseFunction(innerHTML);
}

chrome.runtime.onMessage.addListener(function (message, sender, responseFunction) {
    if (message === 'get_current_document_inner_HTML') {
        getCurrentDocumentInnerHTML(responseFunction);
    }
});
