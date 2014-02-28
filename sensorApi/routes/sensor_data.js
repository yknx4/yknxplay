var sensorData = require('../models/sensorData').SensorData;
      
exports.index = function(req, res) {
  sensorData.find({}, function(err, docs) {
    if(!err) {
      res.json(200, { sensordata: docs });
    } else {
      res.json(500, { message: err });
    }
  });
}
