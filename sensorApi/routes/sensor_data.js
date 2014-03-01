var sensorData = require('../models/sensorData').SensorData;
var dateHelper = require('../helpers/date');

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
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
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
exports.showByDay = function (req, res) {

    var date = new Date();
    var day = req.params.day;

    var low = new Date(date.getFullYear(), date.getMonth(), day, 0, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), day, 23, 59, 59);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
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
exports.showByMonth = function (req, res) {

    var date = new Date();
    var month = req.params.month;
    month--;
    var low = new Date(date.getFullYear(), month, date.getDay(), 0, 0, 0);
    var high = new Date(date.getFullYear(), month, date.getDay(), 23, 59, 59);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
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
exports.showByHourRange = function (req, res) {

    var lower_hour = req.params.low;
    var bigger_hour = req.params.high;
    var low = new Date(date.getFullYear(), date.getMonth(), date.getDay(), lower_hour, 0, 0);
    var high = new Date(date.getFullYear(), date.getMonth(), date.getDay(), bigger_hour, 59, 59);
    //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));
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