
//load data: Load the data associated with the given key
function loadData(key){
chrome.storage.local.get(key, function(data){
    
    return JSON.parse(JSON.stringify(data));
    });
}


//save data: Save the given data to with the given key
function saveData(key, data){

    chrome.storage.local.set({key: JSON.stringify(data)});
}


