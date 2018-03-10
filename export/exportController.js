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
        var csvString = convertToCSV(jsonObject)
        exportCSVFile(csvString)
}


//alternate : this is another convert/export code snippet, but it requires csv header formatting


function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(csvString) {
    var txtFile = "export.csv";
    var file = new File(txtFile);

    file.open("w"); // open file with write access
    file.write(csvString);
    file.close();
}
