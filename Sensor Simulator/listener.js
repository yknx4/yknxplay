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
var banio = false;
var cntBanio = 3;
var lavadoraEncendida = false;
var cntLavadora = 120;
var banandose = false;
var cntBanarse = 5;
var lavarTrastes = false;
var cntLavarTrs = 60;




function generateData() {
    var res = "";
    var ran = new Array();
    ran[0] = 0;
    ran[1] = 0;
    ran[2] = 0;
    ///Probabilidad de ir al baño

    if (banio) {
        var rand = Math.random();
        if (rand == 0)
            if (Math.random() > .5) rand = 1;
        ran[0] += Math.floor(rand * 40) + 28;
        cntBanio--;
        if (cntBanio <= 0) {
            banio = false;
            cntbanio = 3;
        }
    } else if (Math.random() > .99) banio = true;


    var hour = initialDate.getHours();
    switch (hour) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
        if (banandose) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 864) + 288;
            cntBanarse--;
            if (cntBanarse <= 0) {
                banandose = false;
                cntBanarse = 5;
            }
        } else if (Math.random() > .98) banio = true;
        break;
    case 7:
    case 8:
    case 9:
    case 10:
        if (banio) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 40) + 28;
            cntBanio--;
            if (cntBanio <= 0) {
                banio = false;
                cntbanio = 3;
            }
        } else if (Math.random() > .99) banio = true;
        break;
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
        if (banio) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 40) + 28;
            cntBanio--;
            if (cntBanio <= 0) {
                banio = false;
                cntbanio = 3;
            }
        } else if (Math.random() > .98) banio = true;
        break;
    case 16:
    case 17:
        if (banandose) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 864) + 288;
            cntBanarse--;
            if (cntBanarse <= 0) {
                banandose = false;
                cntBanarse = 5;
            }
        } else if (Math.random() > .97) banio = true;
        break;
    case 18:
    case 19:
    case 20:
        if (banio) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 40) + 28;
            cntBanio--;
            if (cntBanio <= 0) {
                banio = false;
                cntbanio = 3;
            }
        } else if (Math.random() > .98) banio = true;
        break;
    case 21:
    case 22:
        if (banandose) {
            var rand = Math.random();
            if (rand == 0)
                if (Math.random() > .5) rand = 1;
            ran[0] += Math.floor(rand * 864) + 288;
            cntBanarse--;
            if (cntBanarse <= 0) {
                banandose = false;
                cntBanarse = 5;
            }
        } else if (Math.random() > .97) banio = true;
        break;
    case 23:
        break;
    }


    var res = cust_hash(0, ran) + ";0";
    for (var i = 0; i < vars.noOfSensors; i++) {
        var tmpM = ran[i];
        res += ";" + tmpM + "";

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