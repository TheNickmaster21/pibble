let lastActiveTab = null;

setInterval(function () {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        if (tabs && tabs[0]) {
            lastActiveTab = tabs[0];
        }
    });
}, 500);

function sendQueryMessageToActiveTabWithCallback(message, callback) {
    if (lastActiveTab) {
        chrome.tabs.sendMessage(lastActiveTab.id, message, callback);
    }
}