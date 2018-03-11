//load data: Load the data associated with the given key
/*function loadData(key) {
    chrome.storage.local.get(key, function (data) {

        return JSON.parse(JSON.stringify(data));
    });
}


//save data: Save the given data to with the given key
function saveData(key, data) {

    chrome.storage.local.set({key: JSON.stringify(data)}, function(){
        alert("Data Saved: " +JSON.stringify(data));
    });
}

*/
//load data: Load the data associated with the given key
//returns false if key is not found
function loadData(key) {
    if (localStorage.getItem(key) != null) {
        return JSON.parse(localStorage.getItem(key));
    } else return false;
}

//save data: Save the given data to with the given key
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(loadData(key));
}
