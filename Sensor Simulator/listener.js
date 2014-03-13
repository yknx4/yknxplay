var sensorData = require("./sensordata");
var vars = require("./global_var");
var crypto = require('crypto');
var global_db;
var global_collection;
var http = require('http');
var crypto = require('crypto');
var noSensors = 3;

var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character

/*

*/
function padLeft(str, len, pad) {
    pad = typeof pad === "undefined" ? "0" : pad + "";
    str = str + "";
    while (str.length < len) {
        str = pad + str;
    }
    return str;
}

function generateData() {
    var res = "";
    var str2hash = "";
    var ran = new Array();
    for (var n = 0; n < vars.noOfSensors; n++) {
        ran[n] = padLeft(Math.floor((((Math.random() * 9999) * (1 + .25 * n)) % 9999)), vars.msgSize - 1);
        str2hash += n + "";
        str2hash += ran[n] + "";
    }

    console.log("String to hash: " + str2hash);
    var local_hash = crypto.createHash('md5').update(vars.secret_word + str2hash).digest('hex');
    local_hash = local_hash.substring(0, vars.hash_size);
    console.log("Local hash (md5): " + local_hash);
    res = local_hash + str2hash;
    console.log("Final message: " + res);
    if(res.length!=vars.hash_size+vars.msg_len){
    	res="0000000000000000"
    }

    var options = {
        host: vars.siteServer,
        port: vars.sitePort,
        path: '/sensor_data/create/' + res
    };

    callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            console.log(str);
        });
    }

    http.request(options, callback).end();
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ", ";

}
/*
function sleep(milliSeconds) {
    var startTime = new Date().getTime(); // get the current time
    while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}*/


setInterval(generateData, vars.time);






// server listening 10.0.0.13:6000
// Connect to the db
//MongoClient.connect("mongodb://192.168.56.101:27017/" + vars.dbName, function (err, db) {


/* db.ensureIndex('more_complex_ensure_index_test', {a:1, b:1}
        , {unique:true, background:true, dropDups:true, w:1}, function(err, indexName) {
*/