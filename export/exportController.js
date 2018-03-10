new Vue({
    el: '#view-full-data',
    methods: {
        dataTab: function () {
            chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')}, function(tab) {
                // Tab opened.
            });
        }
    }
});
