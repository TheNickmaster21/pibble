// Load the JSON data associated with the given key
function loadData(key) {
    if (localStorage.getItem(key) != null) {
        return JSON.parse(localStorage.getItem(key));
    }
    return null;
}

// Save the given JSON data to with the given key
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
