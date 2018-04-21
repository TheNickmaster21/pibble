new Vue({
    el: '#data-table-page',
    methods: {
        load: function () {
            let getDataRows = {action: 'get_data_rows', id: this.selectedDataSetOption.id};
            chrome.runtime.sendMessage(getDataRows, (response) => {
                console.log(response);
                this.savedData = response;
                this.$forceUpdate();
            });
        }
    },
    data: {
        savedData: [],
        dataSetOptions: [],
        selectedDataSetOption: null
    },
    beforeCreate: function () {
        let getRuleSets = {
            action: 'get_rule_sets'
        };
        chrome.runtime.sendMessage(getRuleSets, (response) => {
            this.dataSetOptions = response;
        });
    }
});