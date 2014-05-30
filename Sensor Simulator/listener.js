var sensorData = require("./sensordata");
var vars = require("./global_var");
var crypto = require('crypto');
var global_db;
var global_collection;
var http = require('http');
var crypto = require('crypto');
var noSensors = 3;
var initialDate = new Date(2014, 0, 1, 0, 0, 0, 0);

function trunc(n) {
    return n - n % 1;
}

cust_hash = function (seed, reads) {
    console.log(reads);
    var p1 = 67;
    var p2 = 97;
    var modulus = trunc(trunc((32767 / p2)) / vars.noOfSensors);
    var resultado = 0;
    for (var i = 0; i < vars.noOfSensors; i++) {
        var tmpM = reads[i] % modulus;
        resultado += tmpM * p2;

    }
    resultado /= p1;
    resultado = trunc(resultado);
    resultado = resultado / 2;
    resultado = trunc(resultado);
    resultado += (seed * p2) / p1;
    resultado = trunc(resultado);
    return resultado;
}

var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character

/*

*/

/**
SENSOR 1 = BAÑO
SENSOR 2 = COCINA
SENSOR 3 = LAVADORA

*/


function generateRandom(hour, sensor) {
    if (sensor > 3 || sensor < 1) return 0;
    if (hour > 23 || hour < 0) return 0;
    sensor = sensor - 1;
    var avg_s = [4.8 * .6, 4.8 * 2.0, 4.8 * .9];

    var p_s = []
    var p_s0 = [3, 5, 5, 3, 3, 3, 25, 20, 15, 10, 5, 5, 5, 10, 15, 15, 20, 5, 3, 3, 15, 20, 25, 25];
    var p_s1 = [2, 2, 0, 0, 0, 0, 5, 15, 10, 20, 5, 1, 1, 15, 10, 50, 60, 25, 10, 5, 10, 3, 3, 3];
    var p_s2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 45, 45, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    p_s[0] = p_s0;
    p_s[1] = p_s1;
    p_s[2] = p_s2;
    var prob = p_s[sensor][hour];
    prob /= 100;
    var rnd = Math.random();
    if (rnd < prob) {

        var val = Math.ceil(avg_s[sensor] * (1 + 2 * Math.random() - Math.random()));
        return val;

    }
    return 0;

}


function generateData() {
    var tD = new Date();
    if (initialDate > tD) return;
    console.log();
    console.log(initialDate);
    var res = "";
    var ran = new Array();
    ran[0] = 0;
    ran[1] = 0;
    ran[2] = 0;
    ///Probabilidad de ir al baño



    var hour = initialDate.getHours();
    ran[0] = generateRandom(hour, 1);
    ran[1] = generateRandom(hour, 2);
    ran[2] = generateRandom(hour, 3);
    //console.log(ran);



    var res = cust_hash(1, ran).toString(16) + ";1";
    for (var i = 0; i < vars.noOfSensors; i++) {
        var tmpM = ran[i];
        res += ";" + tmpM.toString(16) + "";

    }





    initialDate = new Date(initialDate.getTime() + 2 * 60000);
    var options = {
        host: vars.siteServer,
        port: vars.sitePort,
        path: '/sensor_data/xcreate/' + res
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
    // console.log('/sensor_data/xcreate/' + res);
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