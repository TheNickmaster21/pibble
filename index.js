new Vue({
    el: '#main-index',
    methods: {
        dataTab: function() {
            chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')});
        }
    }
});