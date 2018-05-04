// Listen for chrome events
chrome.runtime.onMessage.addListener(function (message, src, callback) {
    if (message.action === 'load_page_state') {
        loadState('page_state', callback);
    } else if (message.action === 'save_page_state') {
        saveState('page_state', message);
    }else if (message.action === 'load_rule_set_state') {
        loadState('rule_set_state', callback);
    } else if (message.action === 'save_rule_set_state') {
        saveState('rule_set_state', message);
    } else if (message.action === 'get_rule_sets') {
        returnRuleSets(message, callback);
    } else if (message.action === 'save_rule_sets') {
        saveRuleSets(message);
    } else if (message.action === 'add_row_to_data_set') {
        addDataRow(message);
    } else if (message.action === 'get_data_rows') {
        getDataRows(message, callback)
    } else if (message.action === 'delete_data_set') {
        deleteDataSet(message, callback);
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

// Return all of the rule sets
function returnRuleSets(message, callback) {
    let data = loadData('ruleSets');
    if (data)
        callback(data);
    else
        callback([]);
}

//Save all of the new sets and convert new rule set(s) to the right format if need be
function saveRuleSets(message) {
    let ruleSets = message.data.ruleSets;
    for (let i = 0; i < ruleSets.length; i++) {
        if (ruleSets[i].isNew) {
            ruleSets[i].id = ruleSets.length;
            ruleSets[i] = convertNewRuleSet(ruleSets[i], message.data.tokens);
            saveData('dataSet_' + ruleSets[i].id, []); //Super simple, 1 to 1 w/ rule sets
        }
    }
    saveData('ruleSets', ruleSets);
}

// Add a data row to the given data set
function addDataRow(message) {
    let id = message.id;
    // Make sure they sent an id
    if (typeof id === 'undefined')
        return;
    // Make sure they id matches a rule set (and thus a data set)
    let ruleSets = loadData('ruleSets') || [];
    let ruleSet = _.findWhere(ruleSets, {id: id});
    if (!ruleSet)
        return;
    // Get the row
    let newRow = message.row || [];
    let rows = loadData('dataSet_' + id) || [];
    // Check to make sure the row is unique using the unique flags on the rule set
    let valid = true;
    _.each(rows, function (exitingRow) {
        for (let i = 0; i < ruleSet.rules.length; i++) {
            if (ruleSet.rules[i].unique && exitingRow[i] === newRow[i]) {
                valid = false;
            }
        }
    });
    // If the new row is unique, append it and save teh data set
    if (valid) {
        rows.push(newRow);
        saveData('dataSet_' + id, rows);
    }
}

// Get the given data set
function getDataRows(message, callback) {
    callback(loadData('dataSet_' + message.id));
}

// Delete the given data set and rule set
function deleteDataSet(message, callback) {
    // Get the rule sets
    let ruleSets = loadData('ruleSets');
    if (ruleSets && ruleSets.length >= message.id) {
        // Remove the no longer desired rule set
        ruleSets.splice(message.id - 1, 1);
        // Shift all of the rule set ids backwards and shift the data sets backwards
        for (let index = message.id - 1; index < ruleSets.length; index++) {
            let oldData = loadData('dataSet_' + ruleSets[index].id);
            saveData('dataSet_' + (ruleSets[index].id - 1), oldData);
            ruleSets[index].id = ruleSets[index].id - 1;
        }
        // Save changes
        saveData('ruleSets', ruleSets);
    }

    // Return the new data sets
    returnRuleSets(message, callback);
}