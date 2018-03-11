new Vue({
    el: '#data-table-page',
    methods: {
        load: function () {
            chrome.runtime.sendMessage({action: 'get_data_sets'}, (response) => {
                if(this.selectedDataSetOption.value === 'fortune')
                    this.savedData = response[0];
                else
                    this.savedData = response[1];
                this.$forceUpdate();
            });
        }
    },
    data: {
        savedData: [],
        dataSetOptions: [
            {display: "Fortune", value: "fortune"},
            {display: "Edgar Beta", value: "betaEdgar"}
            ],
        selectedDataSetOption: null
    }
});