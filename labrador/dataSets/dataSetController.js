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
        }
    },
    data: {
        dataSets: []
    },
    beforeMount() {
        this.getLabradorDataSets();
    }
});