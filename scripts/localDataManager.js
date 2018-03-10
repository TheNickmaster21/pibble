
//load data: Load the data associated with the given key
function loadData(key){
chrome.storage.local.get(key, function(data){
    //check if nothing found and alert user
    //if data found return object

    return JSON.parse(JSON.stringify(data));
    });
}


//save data: Save the given data to with the given key
function saveData(key, data){

    chrome.storage.local.set({key: JSON.stringify(data)});
}


//chrome.storage.sync.set({'keyName': keyValue});
//chrome.storage.sync.get('keyName', function(data){
    //return data
//});

/*
JSON.parse(JSON.stringify({test:'t'}));
 */