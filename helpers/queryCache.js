var sensorData = require('../models/sensorData').SensorData;
var sensorDataHelper = require('../helpers/sensorData');
var dateHelper = require('../helpers/date');
var vars = require("../global_var");

exports.monthsDBCache = new Array();
exports.doCache = function () {
    var date = new Date();
    console.log('Cache called');
    for (var i = 0; i < date.getMonth(); i++) exports.monthsDBCache[i] = null;
    for (var i = 0; i < date.getMonth(); i++) {
        console.log("Cache of month " + (i + "") + " called.");
        var pos = i;
        var low = new Date(date.getFullYear(), pos, 1, 0, 0, 0);
        var high = new Date(date.getFullYear(), pos + 1, 0, 0, 0, 0);
        //console.log("Expected date:" + new Date('2014-02-28T03:22:16.414Z'));

        sensorData.find({
            date: {
                $gte: low,
                $lt: high
            }
        }, function (err, docs) {
            //console.log(docs[0].date);
            var jdate = Date.parse(docs[0].date);
            jdate = new Date(jdate);
            var mo = jdate.getMonth();
            console.log("Cache of month " + mo + " ended with " + docs.length + " documents.");
            exports.monthsDBCache[mo] = docs;

        });
    }

}
