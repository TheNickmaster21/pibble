new Vue({
    el: '#export-page',
    methods: {
        dataTab: function () {
            chrome.tabs.create({'url': chrome.extension.getURL('export/dataView.html')}, function (tab) {
                // Tab opened.
            });
        },
        getUsableJSON: function () {
            chrome.runtime.sendMessage({action: 'get_data_sets'}, (response) => {
                if(this.selectedDataSetOption.value === 'fortune')
                    this.exportJSON.gridData = response[0].rows;
                else
                    this.exportJSON.gridData = response[1].rows;
                this.$forceUpdate();
            });
            this.exportJSON.gridColumns = Object.keys(this.exportJSON.gridData[0]);
            console.log(JSON.stringify(this.exportJSON));
            return this.exportJSON;
        },
        exportCSV: function () {
            this.message = "hopefully";
            this.$forceUpdate();
            exportToCSV('selectedDataName' + '.csv', this.getUsableJSON());
        }
    },
    data: {
        message: "Did it work?",
        exportJSON: {
            gridColumns: [],
            gridData: []
        },
        dummy: [
            {
                name: "Chuck Norris",
                power: "Infinity",
                dead: "Alive"
            },
            {
                name: "Bruce Lee",
                power: 9000,
                dead: "Dead"
            },
            {
                name: "Jackie Chan",
                power: 7000,
                dead: "Alive"
            },
            {
                name: "Jet Li",
                power: 8000,
                dead: "Alive"
            }
        ]

    }
});


//*********Haley's code**********//


//pre-condition: json is given or passed as a text/string/object


//convert json to csv
//what I am referencing : https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
//sample code for conversion
/*
const items = json3.items
const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
const header = Object.keys(items[0])
let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
csv.unshift(header.join(','))
csv = csv.join('\r\n')

console.log(csv)./
 */


//save new csv


function saveJSONasCSV(jsonObject) {
    const csvString = convertToCSV(jsonObject);
    exportCSVFile(csvString);
}

//alternate : this is another convert/export code snippet, but it requires csv header formatting

// document.getElementById("export-btn").onclick = function () {
//     console.log("Export Button has been selected");
// };
// document.getElementById("export-btn").onclick = demoExportToCSV;


// filename - this can be anything but it is supposed to be a .csv file
// incomingdata - This MUST match the following format:
//  {
//     "gridColumns": [
//          "columnTitle1",
//          "columnTitle2",
//          "columnTitle3"
//      ],
//     "gridData": [
//          {
//              "columnTitle1": "column1Value1",
//              "columnTitle2": "column2Value1",
//              "columnTitle3": "column3Value1"
//          },
//          {
//              "columnTitle1": "column1Value2",
//              "columnTitle2": "column2Value2",
//              "columnTitle3": "column3Value2"
//          },etc
//     ]
//  }
//

function exportToCSV(filename, incomingData) {
    let rows = [];
    rows.push(incomingData.gridColumns);
    for (let k = 0; k < incomingData.gridData.length; k++) {
        const item = incomingData.gridData[k];
        let temp = [];
        for (let l = 0; l < rows[0].length; l++) {
            const columnTitle = rows[0][l];
            temp.push(item[columnTitle]);
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

function demoExportToCSV() {
    console.log("ExportData Clicked!");
    const filename = "WOOOO.txt";
    const incomingData = {
        "gridColumns": [
            "name",
            "power",
            "dead"
        ],
        "gridData": [
            {
                "name": "Chuck Norris",
                "power": "Infinity",
                "dead": "Alive"
            },
            {
                "name": "Bruce Lee",
                "power": 9000,
                "dead": "Dead"
            },
            {
                "name": "Jackie Chan",
                "power": 7000,
                "dead": "Alive"
            },
            {
                "name": "Jet Li",
                "power": 8000,
                "dead": "Alive"
            }
        ]
    };

    let rows = [];
    console.log("created rows");

    rows.push(incomingData.gridColumns);
    for (let k = 0; k < incomingData.gridData.length; k++) {
        const item = incomingData.gridData[k];
        let temp = [];
        for (let l = 0; l < rows[0].length; l++) {
            const columnTitle = rows[0][l];
            temp.push(item[columnTitle])
        }
        rows.push(temp)
    }

    console.log("populated rows");

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
        console.log("adding row to csv string");
        csvFile += processRow(rows[i]);
    }

    console.log("csv compiled = " + csvFile);


    const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        document.body.innerHTML += "<a id='test' href='data:text;charset=utf-8," + encodeURIComponent("hi") + "' download=myFile.csv>CSV Download Link</a>";
        document.getElementById('test').click();

        // var link = document.createElement("a");
        // if (link.download !== undefined) { // feature detection
        //     // Browsers that support HTML5 download attribute
        //     var url = URL.createObjectURL(blob);
        //     link.setAttribute("href", url);
        //     link.setAttribute("download", filename);
        //     link.style = "visibility:hidden";
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //}
    }
}