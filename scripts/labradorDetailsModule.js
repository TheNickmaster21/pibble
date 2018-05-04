// Listen for browser events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'labrador_get_data_sets') {
        returnLabradorDataSets(message, callback);
    } else if (message.action === 'labrador_add_row_to_data_set') {
        addLabradorDataRow(message);
    } else if (message.action.includes('labrador_pref_save_')) {
        saveLabradorPrefs(message);
    } else if (message.action.includes('labrador_pref_load_')) {
        loadLabradorPrefs(message, callback);
    } else if (message.action === 'labrador_clear_data_set') {
        clearLabradorDataSetRows(message.name);
    }
});

// Loads the last saved state
function loadState(state, callback) {
    callback( loadData(state) );
}

// Saves when a page navigation is done
function saveState(state, message) {
    saveData(state, message.id);
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
function addLabradorDataRow(message) {
    // Make sure id was sent
    let id = message.id;
    if (typeof id === 'undefined') {
        return;
    }
    let newRow = message.row;
    let rows = loadData(id + 'rows') || [];
    let valid = true;
    // Make sure there is data in all of the fields
    for (let i = 0; i < labradorDataSets[id].columns.length; i++) {
        if (!newRow[i]) {
            valid = false;
        }
    }
    // Make sure this is not a duplicate row
    _.each(rows, function (exitingRow) {
        for (let i = 0; i < labradorDataSets[id].columns.length; i++) {
            if (labradorDataSets[id].columns[i].unique && exitingRow[i] === newRow[i]) {
                valid = false;
            }
        }
    });
    // Save the row if valid
    if (valid) {
        rows.push(newRow);
        saveData(id + 'rows', rows);
    }
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

// Save?
function saveLabradorPrefs(message) {
    saveData(message.action);
}

// Load
function loadLabradorPrefs(message, callback) {
    callback(loadData(message.action));
}