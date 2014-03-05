var sensorData = require('../models/sensorData').SensorData;
var sensorDataHelper = require('../helpers/sensorData');
var dateHelper = require('../helpers/date');
var fs = require('fs');
var vars = require("../global_var");
var queryCache = require("../helpers/queryCache");
var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character


function getDateRange(low, high, res) {
    console.log("Query between " + low + " and " + high);
    sensorData.find({
        date: {
            $gte: low,
            $lt: high
        }
    }, function (err, docs) {
        if (!err) {
            res.json(200, {
                sensordata: docs
            });
        } else {
            res.json(500, {
                message: err
            });
        }
    });
}

function getMonthParsed(low, high, res) {
    console.log("Query between " + low + " and " + high);
    var deeto = new Date();
    var newSensorData = {
        date: new Date(),
        count: 0,
        sensorValues: new Array()
    };
    var days = new Array();

    var totalSensors = new Array();
    for (var i = 0; i < vars.noOfSensors; i++) {
        totalSensors[i] = 0;
    }

    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
    if (low.getMonth() >= deeto.getMonth() || queryCache.monthsDBCache[low.getMonth()] == null) {
        sensorData.find({
            date: {
                $gte: low,
                $lt: high
            }
        }, function (err, docs) {
            if (!err) {
                res.json(200, {
                    sensordata: docs
                });
            } else {
                res.json(500, {
                    message: err
                });
            }
        });
    } else {
        console.log("Using cache");
        var monthData = queryCache.monthsDBCache[low.getMonth()];

        function tmpDayData() {
            return {
                date: new Date(),
                sensorValues: new Array()
            };
        };
        newSensorData.count = monthData.length;
        newSensorData.date = low;
        monthData.forEach(function (val, index, ar) {
            var valDate = new Date(val.date);
            for (var i = 0; i < vars.noOfSensors; i++) {
                totalSensors[i] += parseInt(val.sensorValues[i]);
                days[valDate.getDay][i] += parseInt(val.sensorValues[i]);
            }

        });
        newSensorData.sensorValues = totalSensors;

        res.json(200, {
            sensordata: newSensorData
        });
    }


}

exports.index = function (req, res) {
    sensorData.find({}, function (err, docs) {
        if (!err) {
            res.json(200, {
                sensordata: docs
            });
        } else {
            res.json(500, {
                message: err
            });
        }
    });
}

exports.show = function (req, res) {

    var id = req.params.id;
    sensorData.findById(id, function (err, doc) {
        if (!err && doc) {
            res.json(200, doc);
        } else if (err) {
            res.json(500, {
                message: "Error loading sensor values." + err
            });
        } else {
            res.json(404, {
                message: "Sensor values not found."
            });
        }
    });
}
//{date: { $gte: low, $lt: high }},
exports.showByDateRange = function (req, res) {

    var lower_date = req.params.low;
    var bigger_date = req.params.high;
    var low = dateHelper.parseDateInUrl(lower_date);
    var high = dateHelper.parseDateInUrl(bigger_date);
    var dif = high.getTime() - low.getTime()
    var Seconds_from_T1_to_T2 = dif / 1000;
    var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
    console.log("Query between " + (Seconds_Between_Dates / 3600) / 24 + "days.");
    if (Seconds_Between_Dates > 604800) {
        res.json(500, {
            message: 'Cannot query more than a week timespan.'
        });
    } else {
        getDateRange(low, high, res);
    }
}
exports.showByDay = function (req, res) {

    var date = new Date();
    var day = req.params.day;

    var low = new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), day, 23, 59, 59);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
    console.log("Query between " + low + " and " + high);
    getDateRange(low, high, res);
}
exports.showByMonth = function (req, res) {

    var date = new Date();
    var month = req.params.month;
    month--;
    var low = new Date(date.getFullYear(), month, 1, 0, 0, 0);
    var high = new Date(date.getFullYear(), month + 1, 1, 0, 0, 0);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
    if (month >= date.getMonth() || queryCache.monthsDBCache[month] == null) {
        getDateRange(low, high, res);
    } else {
        console.log("Using cache");
        res.json(200, {
            sensordata: queryCache.monthsDBCache[month]
        });
    }
}
exports.showByMonthParsed = function (req, res) {

    var date = new Date();
    var month = req.params.month;
    month--;
    var low = new Date(date.getFullYear(), month, 1, 0, 0, 0);
    var high = new Date(date.getFullYear(), month + 1, 1, 0, 0, 0);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
    getMonthParsed(low, high, res);
}
exports.showByHourRange = function (req, res) {

    var lower_hour = req.params.low;
    var bigger_hour = req.params.high;
    var low = new Date(date.getFullYear(), date.getMonth(), date.getDay(), lower_hour, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), date.getDay(), bigger_hour, 59, 59);
    getDateRange(low, high, res);
}
exports.create = function (req, res) {

    var full_msg = req.params.msg

    console.log("Input requested with following string: " + full_msg);
    if (sensorDataHelper.validate(full_msg)) {
        console.log("Valid Data");
        full_msg = full_msg.substring(vars.hash_size - 1, full_msg.length);
        var newSensorData = sensorDataHelper.getSensorDataFromMsg(full_msg);
        //console.log(newSensorData);

        newSensorData.save(function (err) {

            if (!err) {
                //fs.appendFile("mydata.txt", dateHelper.getDateTime() + full_msg + crlf, encoding = 'utf8', function (err) {}); //write the value to file and add CRLF for line break
                res.json(201, {
                    message: "sensorData created on: " +
                        newSensorData.date
                });
            } else {
                res.json(500, {
                    message: "Could not create sensorData.Error: " + err
                });
            }

        });



    } else {
        console.log("Inalid Data");
        res.json(500, {
            message: "Could not create sensorData: Invalid input string"
        });
    }
}