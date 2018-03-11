new Vue({
    el: '#dataSet-page',
    methods: {
        newDataSetName: function (newName) {

        },
        getDataSetNames: function () {
            let data = {action: 'get_data_sets'};
            chrome.runtime.sendMessage(data, (dataSets) => {
                this.dataSetNames = dataSets;
                this.$forceUpdate();
            });
        },
        isDataSetNameTaken: function () {
            return false;
        }
    },
    data: {
        dataSetNames: []
    }
});