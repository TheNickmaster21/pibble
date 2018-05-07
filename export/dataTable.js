new Vue({
    el: '#table-page',
    data: {
        savedData: [],
        dataSetOptions: [],
        selectedDataSetOption: null,
        filename: "export",
        exportJSON: {
            gridColumns: [],
            gridData: []
        }
    },
    methods: {
        load: function () {
            let getDataRows = {action: 'get_data_rows', id: this.selectedDataSetOption.id};
            chrome.runtime.sendMessage(getDataRows, (response) => {
                this.savedData = response;
                this.$forceUpdate();
            });
        },
        save: function () {
            //maybe edit feature
        },
        selectDataSetOption: function (option) {
            this.selectedDataSetOption = option;
            let saveRuleSetState = {
                action: 'save_rule_set_state',
                id: option && option.id
            };
            chrome.runtime.sendMessage(saveRuleSetState);
        },
        deleteDataSet: function () {
            let getDataRows = {action: 'delete_data_set', id: this.selectedDataSetOption.id};
            chrome.runtime.sendMessage(getDataRows, (response) => {
                this.dataSetOptions = response;
                this.selectedDataSetOption = null;
                this.$forceUpdate();
            });
        },
        exportCSV: function () {
            let getDataRows = {action: 'get_data_rows', id: this.selectedDataSetOption.id};
            chrome.runtime.sendMessage(getDataRows, (response) => {
                this.filename = this.selectedDataSetOption.name;
                this.exportJSON.gridData = response;
                this.exportJSON.gridColumns = _.pluck(this.selectedDataSetOption.rules, 'name');
                exportToCSV(this.filename + '.csv', this.exportJSON);
            });
            this.$forceUpdate();
        }
    },
    beforeCreate: function () {
        let getRuleSets = {
            action: 'get_rule_sets'
        };
        chrome.runtime.sendMessage(getRuleSets, (response) => {
            this.dataSetOptions = response;
            let loadRuleSetState = {
                action: 'load_rule_set_state'
            };
            chrome.runtime.sendMessage(loadRuleSetState, (id) => {
                this.selectedDataSetOption = _.findWhere(this.dataSetOptions, {id: id});
                if (this.selectedDataSetOption) {
                    this.load();
                }
            });
        });
    }
});


function exportToCSV(filename, incomingData) {
    let rows = [];
    rows.push(incomingData.gridColumns);
    for (let k = 0; k < incomingData.gridData.length; k++) {
        const item = incomingData.gridData[k];
        let temp = [];
        for (let l = 0; l < rows[0].length; l++) {
            //const columnTitle = rows[0][l];
            temp.push(item[l]);
        }
        rows.push(temp);
    }


    const processRow = function (row) {
        let finalVal = '';
        for (let j = 0; j < row.length; j++) {
            let innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            }
            let result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + "\r\n";
    };

    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
