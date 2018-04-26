new Vue({
    el: '#main-index',
    data: {
        toggleLab: true
    },
    methods: {
        dataTab: function() {
            chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')});
        },
        toggleLabView: function () {
            this.toggleLab = !this.toggleLab;
        }
    }
});