function doStuffWithDocument(innerHTML) {
    console.log('I received the following DOM content:\n' + innerHTML);
}

setInterval(function () {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        let activeTab = tabs[o];
        if (activeTab) {
            chrome.tabs.sendMessage(activeTab.id, 'get_current_document_inner_HTML', doStuffWithDocument);
        }
    });
}, 5000);