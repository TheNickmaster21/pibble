let indexVue = new Vue({
    el: '#main-index',
    data: {
        toggleLab: true
    },
    methods: {
        dataTab: function(isLab) {
            if(isLab)
                chrome.tabs.create({'url': chrome.extension.getURL('labrador/export/dataView.html')});
            else
                chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')});
        },
        toggleLabView: function () {
            this.toggleLab = !this.toggleLab;
            const saveLabToggle = {
                action: 'save_lab_toggle',
                id: indexVue.toggleLab
            };
            chrome.runtime.sendMessage(saveLabToggle);
        },
        updatePageState: function(page) {
            const savePageState = {
                action: 'save_page_state',
                id: page
            };
            chrome.runtime.sendMessage(savePageState);
        }
    },
    mounted: function() {
        //this.updatePageState('/index.html');
        const loadPageState = {
            action: 'load_page_state'
        };
        const loadLabToggleState = {
            action: 'load_lab_toggle'
        };
        chrome.runtime.sendMessage(loadPageState, response => {
            if(response) {
                if (response === '/index.html')
                    chrome.runtime.sendMessage(loadLabToggleState, response => {
                        if(response != null)
                            indexVue.toggleLab = response;
                    });
                else
                    window.open(response, '_self');
            }
        });
    }
});