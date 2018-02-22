function doStuffWithDocument(innerHTML) {
    console.log('I received the following DOM content:\n' + innerHTML);
}

setInterval(function () {
    chrome.tabs.query({active: true}, function (tabs) {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, 'get_current_document_inner_HTML', doStuffWithDocument);
        }
    });
}, 5000);