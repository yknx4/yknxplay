var sensorData = require('../models/sensorData').SensorData;
var sensorDataHelper = require('../helpers/sensorData');
var dateHelper = require('../helpers/date');
var fs = require('fs');

var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character

function reponseWithJson(result, res) {
    var err = result.err;
    var docs = result.docs;
    if (!err) {
        res.json(200, {
            sensordata: docs
        });
    } else {
        res.json(500, {
            message: err
        });
    }
}

function getDateRange(low, high, callback_wParam) {
    console.log("Query between " + low + " and " + high);
    var result = {};
    var done = false;

    sensorData.find({
        date: {
            $gte: low,
            $lt: high
        }
    }, function (err, docs) {
        console.log('Query completed with ' + docs.length + ' results.');
        result = {
            err: err,
            docs: docs
        };
        callback_wParam[0].call(result, callback_wParam[1]);
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

    var query = getDateRange(low, high, [reponseWithJson, res]);

}
exports.showByMonth = function (req, res) {
    var result = new Array();
    var date = new Date();
    var month = req.params.month;
    month--;
    var low = new Date(date.getFullYear(), month, 1, 0, 0, 0);
    var high = new Date(date.getFullYear(), month + 1, 0, 0, 0, 0);



}
exports.showByHourRange = function (req, res) {

    var lower_hour = req.params.low;
    var bigger_hour = req.params.high;
    var low = new Date(date.getFullYear(), date.getMonth(), date.getDay(), lower_hour, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), date.getDay(), bigger_hour, 59, 59);
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
exports.create = function (req, res) {

    var full_msg = req.params.msg
    console.log("Input requested with following string: " + full_msg);
    if (sensorDataHelper.validate(full_msg)) {
        console.log("Valid Data");
        var newSensorData = sensorDataHelper.getSensorDataFromMsg(full_msg);


        newSensorData.save(function (err) {

            if (!err) {
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