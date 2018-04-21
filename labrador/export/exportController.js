new Vue({
    el: '#export-page',
    methods: {
        dataDropdownSelect: function (option) {
            this.selectedDataSetOption = option;
        },
        dataTab: function () {
            chrome.tabs.create({'url': chrome.extension.getURL('labrador/export/dataView.html')});
        },
        exportCSV: function () {
            chrome.runtime.sendMessage({action: 'labrador_get_data_sets'}, (response) => {
                if (this.selectedDataSetOption.value === 'fortune') {
                    this.filename = response[0].name;
                    this.exportJSON.gridData = response[0].rows;
                    this.exportJSON.gridColumns = _.pluck(response[0].columns, 'name');
                } else {
                    this.filename = response[1].name;
                    this.exportJSON.gridData = response[1].rows;
                    this.exportJSON.gridColumns = _.pluck(response[1].columns, 'name');
                }

                exportToCSV(this.filename + '.csv', this.exportJSON);

            });
            this.$forceUpdate();
        }
    },
    data: {
        filename: "export",
        dataSetOptions: [
            {display: "Fortune", value: "fortune"},
            {display: "Edgar Beta", value: "betaEdgar"}
        ],
        selectedDataSetOption: null,
        exportJSON: {
            gridColumns: [],
            gridData: []
        }
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
