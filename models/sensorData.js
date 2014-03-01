var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

      
var sensorDataSchema = new Schema({
     sensorValues : { type: Array, required: true, index: true }
  , date : { type: Date, required: true, default: Date.now
}
}, { collection: 'sensorData' });

      
var sensordata = mongoose.model('sensordata', sensorDataSchema);
      
module.exports = {
  SensorData: sensordata
};