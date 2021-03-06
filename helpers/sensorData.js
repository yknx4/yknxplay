var vars = require("../global_var");
var crypto = require('crypto');
var sensorData = require('../models/sensorData').SensorData;
exports.validate = function (full_msg) {
    var hash = full_msg.substring(0, vars.hash_size);
    var sensors_msg = full_msg.substring(vars.hash_size, vars.hash_size + vars.msg_len);
    console.log("Remote hash (md5): " + hash);
    var string2hash = vars.secret_word + sensors_msg;
    var local_hash = crypto.createHash('md5').update(string2hash).digest('hex');
    local_hash = local_hash.substring(0, vars.hash_size);
    console.log("Local hash (md5): " + local_hash);
    if (local_hash == hash) {
        console.log("Valid Data!");
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
    for (var i = 0; i < vars.noOfSensors; i++) {
        var start = (2 + vars.msgSize * i);
        var end = 1 + vars.msgSize + vars.msgSize * i;
        //console.log('from ' + start + ' to ' + end);
        var sensor_msg = full_msg.substring(start, end);
        sensor_data[i] = parseInt(sensor_msg);
    }
    //    result.date = new Date();
    /*This will be just for randomizing*/
    result.date = new Date();
    //tmpDate.setMinutes(tmpDate.getMinutes() + 2);
    result.sensorValues = sensor_data;
    return result;
}