var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var vars = require("../global_var");

var defaultSen = new Array(vars.noOfSensors);
for (var i = 0; i < vars.noOfSensors; i++) {
    defaultSen[i] = 0;
}
var sensorDataSchema = new Schema({
    sensorValues: {
        type: Array,
        required: true,
        default: defaultSen
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    }
}, {
    collection: 'sensorData'
});


var sensordata = mongoose.model('sensordata', sensorDataSchema);

module.exports = {
    SensorData: sensordata
};