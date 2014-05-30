var vars = require("../global_var");
var crypto = require('crypto');
var sensorData = require('../models/sensorData').SensorData;
var key = "JORGJORGJORGJORG";

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


exports.validate = function (full_msg) {
    //    var oriSeed = String.fromCharCode(27);
    var reads = [];
    var oriSeed = 27;
    var args = full_msg.split(";");
    console.log("Args: " + args);
    var hash = parseInt(args[0], 16);
    console.log("Remote Hash: " + hash);
    var rndSeed = parseInt(args[1], 16);
    console.log("rndSeed: " + rndSeed);
    for (var i = 2; i < vars.noOfSensors + 2; i++) {
        var tVal = parseInt(args[i], 16);
        console.log("s Value " + (i - 2) + " :" + tVal);
        reads.push(tVal);
    }
    var local_hash = cust_hash(rndSeed, reads);
    console.log("Local hash: " + local_hash);
    if (local_hash == hash) {
        console.log("Valid Data!");
        //return true;
        return true;

    } else {
        console.log("Invalid Data!");
        return false;
    }
}
//var tmpDate = new Date(2014, 0, 1, 0, 0, 0);
exports.getSensorDataFromMsg = function (full_msg) {
    var result = new sensorData();
    var sensor_data = new Array();
    var args = full_msg.split(";");
    for (var i = 2; i < vars.noOfSensors + 2; i++) {
        var tVal = parseInt(args[i], 16);
        sensor_data.push(tVal);
    }
    //    result.date = new Date();
    /*This will be just for randomizing*/
    result.date = new Date();
    //tmpDate.setMinutes(tmpDate.getMinutes() + 2);
    result.sensorValues = sensor_data;
    return result;
}