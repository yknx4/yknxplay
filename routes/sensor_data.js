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

function newResult() {
    var result = new Object();
    result.count = new Array();
    result.sensorValues = new Array();
    result.date = new Date();
    return result;
}

function newDayData(nDate, day) {

    var result = newResult();
    result.date = new Date(nDate.getFullYear(), nDate.getMonth(), day, 0, 0, 0);
    return result;
}

function newHourData(nDate, hour) {
    var result = newResult();
    result.date = new Date(nDate.getFullYear(), nDate.getMonth(), nDate.getDate(), hour, 0, 0);
    return result;
}

function parseMonthData(high, monthData) {
    var result = new Array();
    var daysData = new Array();
    var totalCount = new Array();
    var totalSensors = new Array();
    /*Array Initialization*/
    for (var i = 0; i < vars.noOfSensors; i++) {
        totalSensors[i] = 0;
        totalCount[i] = 0;
    }
    for (var day = 0; day < high.getDate(); day++) {
        // console.log(day + " dafack");
        var tmpDay = newDayData(high, day + 1);
        daysData[day] = tmpDay;
        //console.log(daysData[day].date);
        for (var i = 0; i < vars.noOfSensors; i++) {
            daysData[day].sensorValues[i] = 0;
            daysData[day].count[i] = 0;
        }
    }
    monthData.forEach(function (val, index, ar) {
        var valDate = new Date(val.date);
        for (var i = 0; i < vars.noOfSensors; i++) {
            totalSensors[i] += parseInt(val.sensorValues[i]);
            if (typeof daysData[valDate.getDate() - 1] == "undefined") {
                console.log("Error on: " + valDate.getDate());
            } else {
                totalCount[i]++;
                // console.log("Inserted on " + valDate.getDate() + " dia.");
                daysData[valDate.getDate() - 1].sensorValues[i] += parseInt(val.sensorValues[i]);
                daysData[valDate.getDate() - 1].count[i]++;

            }

        }

    });
    return {
        daysData: daysData,
        totalData: totalSensors,
        totalCount: totalCount
    };
}

function parseDayData(high, dayData) {
    var result = new Array();
    var totalCount = new Array();
    var hoursData = new Array();
    var totalSensors = new Array();
    /*Array Initialization*/
    for (var i = 0; i < vars.noOfSensors; i++) {
        totalSensors[i] = 0;
        totalCount[i] = 0;
    }
    for (var hour = 0; hour < 24; hour++) {
        // console.log(day + " dafack");
        var tmpHour = newHourData(high, hour + 1);
        hoursData[hour] = tmpHour;
        //console.log(daysData[day].date);
        for (var i = 0; i < vars.noOfSensors; i++) {
            hoursData[hour].sensorValues[i] = 0;
            hoursData[hour].count[i] = 0;
        }
    }
    dayData.forEach(function (val, index, ar) {
        var valDate = new Date(val.date);
        for (var i = 0; i < vars.noOfSensors; i++) {
            var vl = parseInt(val.sensorValues[i]);
            var v2;
            if (isNaN(vl)) v2 = 0;
            else v2 = vl;
            totalSensors[i] += v2;

            if (typeof hoursData[valDate.getHours() - 1] == "undefined") {
                console.log("Error on: " + valDate.getDate());
            } else {
                totalCount[i]++;
                // console.log("Inserted on " + valDate.getDate() + " dia.");
                hoursData[valDate.getHours() - 1].sensorValues[i] += parseInt(val.sensorValues[i]);
                hoursData[valDate.getHours() - 1].count[i]++;
            }

        }

    });
    return {
        hoursData: hoursData,
        totalData: totalSensors,
        totalCount: totalCount
    };
}

function getMonthParsed(low, high, res) {
    console.log("Query between " + low + " and " + high);
    var deeto = new Date();
    /*Temporal Data*/
    var monthData;
    var parsedData;
    var newSensorData = {
        date: new Date(),
        count: new Array(),
        sensorValues: new Array(),
        days: new Array()
    };
    newSensorData.date = low;
    /*Parse Data*/
    if (low.getMonth() >= deeto.getMonth() || queryCache.monthsDBCache[low.getMonth()] == null) {
        sensorData.find({
            date: {
                $gte: low,
                $lt: high
            }
        }, function (err, docs) {
            if (!err) {
                monthData = docs;
                //newSensorData.count = monthData.length;

                parsedData = parseMonthData(high, monthData);
                newSensorData.count = parsedData.totalCount;
                newSensorData.days = parsedData.daysData;
                newSensorData.sensorValues = parsedData.totalData;
                res.json(200, {
                    sensordata: newSensorData
                });
            } else {
                res.json(500, {
                    message: err
                });
            }
        });
    } else {
        console.log("Using cache");
        monthData = queryCache.monthsDBCache[low.getMonth()];

        parsedData = parseMonthData(high, monthData);
        newSensorData.count = parsedData.totalCount;
        newSensorData.days = parsedData.daysData;
        newSensorData.sensorValues = parsedData.totalData;
        res.json(200, {
            sensordata: newSensorData
        });
    }


}

function getDayParsed(low, high, res) {
    console.log("Query between " + low + " and " + high);
    var deeto = new Date();
    /*Temporal Data*/
    var dayData;
    var parsedData;
    var newSensorData = {
        date: new Date(),
        count: new Array(),
        sensorValues: new Array(),
        hours: new Array()
    };
    newSensorData.date = low;
    /*Parse Data*/

    sensorData.find({
        date: {
            $gte: low,
            $lt: high
        }
    }, function (err, docs) {
        if (!err) {
            dayData = docs;
            //newSensorData.count = dayData.length;
            parsedData = parseDayData(high, dayData);
            newSensorData.count = parsedData.totalCount;
            newSensorData.hours = parsedData.hoursData;
            newSensorData.sensorValues = parsedData.totalData;
            res.json(200, {
                sensordata: newSensorData
            });
        } else {
            res.json(500, {
                message: err
            });
        }
    });



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
    var high = new Date(date.getFullYear(), month + 1, 0, 23, 59, 59);
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
exports.showByDayParsed = function (req, res) {

    var date = new Date();
    var day = req.params.day;

    var low = new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), day + 1, 0, 0, 0);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
    console.log("Query between " + low + " and " + high);
    getDayParsed(low, high, res);
}
exports.showByDayMonthParsed = function (req, res) {

    var date = new Date();
    var year = req.params.year;
    if (year > date.getFullYear()) year = date.getFullYear();
    var day = req.params.day;
    var month = req.params.month;
    month--;
    var low = new Date(year, month, day, 0, 0, 0);
    var high = new Date(year, month, day + 1, 0, 0, 0);

    console.log("Query between " + low + " and " + high);
    getDayParsed(low, high, res);
}
exports.showByMonthParsed = function (req, res) {

    var date = new Date();
    var year = req.params.year;
    if (year > date.getFullYear()) year = date.getFullYear();
    var month = req.params.month;
    month--;
    var low = new Date(year, month, 1, 0, 0, 0);
    var high = new Date(year, month + 1, 0, 23, 59, 59);

    getMonthParsed(low, high, res);
}
exports.showByHourRange = function (req, res) {
    var date = new Date();
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