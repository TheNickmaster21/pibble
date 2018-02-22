chrome.runtime.onMessage.addListener(function (message, sender, responseFunction) {
    if (message === 'get_current_document_inner_HTML') {
        responseFunction(document.documentElement.innerHTML);
    }
});
