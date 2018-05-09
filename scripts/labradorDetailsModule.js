// Listen for browser events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'labrador_get_data_sets') {
        returnLabradorDataSets(message, callback);
    } else if (message.action === 'labrador_add_row_to_data_set') {
        addLabradorDataRow(message, callback);
    } else if (message.action === 'labrador_load_rule_set_state') {
        loadLabradorState('rule_set_state', callback);
    } else if (message.action === 'labrador_save_rule_set_state') {
        saveLabradorState('rule_set_state', message);
    } else if (message.action === 'labrador_clear_data_set') {
        clearLabradorDataSetRows(message.name);
    }
});

// Loads the last saved state
function loadLabradorState(state, callback) {
    callback(loadData('labrador' + state));
}

// Saves when a page navigation is done
function saveLabradorState(state, message) {
    saveData('labrador' + state, message.id);
}

// Clear the data for the given data set
function clearLabradorDataSetRows(name) {
    if (name === 'Fortune Data') {
        saveData('0rows', [])
    } else {
        saveData('1rows', []);
    }
}

// Return data sets with their rows
function returnLabradorDataSets(message, callback) {
    _.each(labradorDataSets, function (dataSet) {
        dataSet.rows = loadData(dataSet.id + 'rows') || [];
    });
    callback(labradorDataSets);
}

// Add a row to a data set
function addLabradorDataRow(message, callback) {
    // Make sure id was sent
    let id = message.id;
    if (typeof id === 'undefined') {
        return;
    }
    let newRow = message.row;
    let rows = loadData(id + 'rows') || [];
    // Make sure there is data in all of the fields
    for (let i = 0; i < labradorDataSets[id].columns.length; i++) {
        if (!newRow[i]) {
            return; //Given data is bad; don't save it
        }
    }
    let unique = true;
    // Make sure this is not a duplicate row
    _.each(rows, function (exitingRow, index) {
        let replaceThisRow = false;
        for (let i = 0; i < labradorDataSets[id].columns.length; i++) {
            if (labradorDataSets[id].columns[i].unique && exitingRow[i] === newRow[i]) {
                unique = false;
                replaceThisRow = true;
            }
        }
        if (replaceThisRow) {
            rows[index] = newRow;
        }
    });
    // Save the row if valid
    if (unique) {
        rows.push(newRow);
    }
    saveData(id + 'rows', rows);
    callback(unique);
}

// Labrador data set definitions
let labradorDataSets = [
    {
        id: 0,
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
        id: 1,
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