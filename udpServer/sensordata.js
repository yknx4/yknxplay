var vars = require("../global_var")
this.newSensorData = function (date, sensorValues) {
    var result = {};
    result.sensorValues = sensorValues;
    result.date = date;
    result.print = function () {
        var size = this.sensorValues.length;
        for (var i = 0; i < size; i++) {
            console.log("Sensor " + (i + 1) + ": " + this.sensorValues[i]);
        }
        console.log(JSON.stringify(result));
    }
    return result;
}
this.getSensorDataFromMsg = function (msg) {

    var sensor_data = new Array();
    var full_msg = String(msg);
    for (var i = 0; i < vars.noOfSensors; i++) {
        var sensor_msg = full_msg.substring(1 + vars.msgSize * i, vars.msgSize + vars.msgSize * i);
        sensor_data[i] = sensor_msg;
    }
    //    var result = this.newSensorData(new Date(), sensor_data);
    /*This will be just for randomizing*/
    var curDate = new Date();
    var ranMonth = Math.floor((Math.random() * 5));
    var ranDay = Math.floor((Math.random() * 28) + 1);
    var ranHour = Math.floor((Math.random() * 23) + 1);
    var ranMinute = Math.floor((Math.random() * 59) + 1);
    var fDate = new Date(curDate.getFullYear(), ranMonth, ranDay, ranHour, ranMinute, 0);
    var result = this.newSensorData(fDate, sensor_data);
    return result;
}