new Vue({
    el: '#dataSet-page',
    methods: {
        getLabradorDataSets: function () {
            let data = {action: 'labrador_get_data_sets'};
            chrome.runtime.sendMessage(data, (dataSets) => {
                this.dataSets = dataSets;
                this.$forceUpdate();
            });
        },
        clearRows: function (dataSetName) {
            let data = {action: 'labrador_clear_data_set', name: dataSetName};
            chrome.runtime.sendMessage(data);
        },
        updatePageState: function(page) {
            const savePageState = {
                action: 'save_page_state',
                id: page
            };
            chrome.runtime.sendMessage(savePageState);
        }
    },
    data: {
        dataSets: []
    },
    beforeMount() {
        this.getLabradorDataSets();
    }
});