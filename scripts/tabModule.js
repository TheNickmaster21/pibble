let lastActiveTab = null;

// Track the active tab over time
setInterval(function () {
    let activeTabFilter = {active: true, currentWindow: true};
    chrome.tabs.query(activeTabFilter, function (tabs) {
        if (tabs && tabs[0]) {
            lastActiveTab = tabs[0];
        }
    });
}, 500);

// Give other functions a chance to send events to active tabs
function sendQueryMessageToActiveTabWithCallback(message, callback) {
    if (lastActiveTab) {
        chrome.tabs.sendMessage(lastActiveTab.id, message, callback);
    }
}