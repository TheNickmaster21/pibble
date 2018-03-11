chrome.runtime.onMessage.addListener(function (message, src, callback) {
    console.log(message);
    if (message.action === 'get_data_sets') {
        for (let i = 0; i < dataSets.length; i++) {
            let dataSet = dataSets[i];
            dataSet.rows = loadData(dataSet.id + 'rows') || [];
        }
        callback(dataSets);
    } else if (message.action === 'add_row_to_data_set') {
        if (message.id) {
            let rows = loadData(message.id + 'rows') || [];
            let nonUniqueRows = _.filter(rows, function (row) {
                let unique = true;
                _.each(rows, function (oldRow) {
                    for (let i = 0; i < oldRow.length; i++) {
                        if (dataSets[message.id - 1].columns[i].unique && oldRow[i] === row[i]) {
                            unique = false;
                        }
                    }
                });
                return !unique;
            });
            if (nonUniqueRows.length === 0) {
                rows.push(message.row);
                saveData(message.id + 'rows', rows);
            }
        }
    }
});

let dataSets = [
    {
        id: 1,
        name: "Fortune Data",
        columns: [
            {name: "Ticker", unique: true},
            {name: "Rank", unique: false},
            {name: "Revenue", unique: false},
            {name: "Revenue Change", unique: false},
            {name: "Profits", unique: false},
            {name: "Profits Change", unique: false},
            {name: "Assets", unique: false},
            {name: "Market Value", unique: false},
            {name: "Employees", unique: false},
            {name: "Previous Rank", unique: false},
            {name: "CEO", unique: false},
            {name: "CEO Title", unique: false},
            {name: "Sector", unique: false},
            {name: "Industry", unique: false},
            {name: "HQ Location", unique: false},
            {name: "Website", unique: false},
            {name: "Years on Fortune", unique: false},
            {name: "Market", unique: false}
        ],
        rows: []
    },
    {
        id: 2,
        name: "Edgar Data",
        columns: [
            {name: "Name", unique: false},
            {name: "CIK", unique: true},
            {name: "Mailing Address", unique: false},
            {name: "Business Address", unique: false},
            {name: "SIC", unique: false},
            {name: "Industry", unique: false},
            {name: "State Location", unique: false}
        ],
        rows: []
    },
];
