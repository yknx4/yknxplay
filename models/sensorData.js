var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var sensorDataSchema = new Schema({
    sensorValues: {
        type: Array,
        required: true
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