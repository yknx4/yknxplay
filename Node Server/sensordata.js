var vars = require("./global_var")
this.newSensorData = function(date,sensorValues)
{
	var result={ };
	result.sensorValues=sensorValues;
	result.date=date;
	result.print = function(){
		var size = this.sensorValues.length;
		for(var i =0;i<size;i++){
			console.log("Sensor "+(i+1)+": "+this.sensorValues[i]);
		}
        console.log(JSON.stringify(result));
	}
	return result;
}
this.getSensorDataFromMsg = function(msg){
	var date = new Date();
	var sensor_data = new Array();
	var full_msg = String(msg);
	for(var i =0;i<vars.noOfSensors;i++){
		var sensor_msg = full_msg.substring(1+vars.msgSize*i,vars.msgSize+vars.msgSize*i);
		sensor_data[i]=sensor_msg;
	}
	var result = this.newSensorData(date.getTime(),sensor_data);
	return result;
}