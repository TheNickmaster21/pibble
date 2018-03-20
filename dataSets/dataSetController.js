new Vue({
    el: '#dataSet-page',
    methods: {
        getDataSets: function () {
            let data = {action: 'get_data_sets'};
            chrome.runtime.sendMessage(data, (dataSets) => {
                this.dataSets = dataSets;
                this.$forceUpdate();
            });
        },
        clearRows: function (dataSetName) {
            let data = {action: 'clear_data_set', name: dataSetName};
            chrome.runtime.sendMessage(data);
        }
    },
    data: {
        dataSets: []
    },
    beforeMount() {
        this.getDataSets();
    }
});