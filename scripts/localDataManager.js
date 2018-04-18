//load data: Load the JSON data associated with the given key
function loadData(key) {
    console.log('load', key, localStorage.getItem(key));
    if (localStorage.getItem(key) != null) {
        return JSON.parse(localStorage.getItem(key));
    }
    return null;
}

//save data: Save the given JSON data to with the given key
function saveData(key, data) {
    console.log('save', key, data);
    localStorage.setItem(key, JSON.stringify(data));
}
