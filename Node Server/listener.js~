var dgram = require("dgram");
var sensorData = require("./sensordata");
var vars = require("./global_var");
var server = dgram.createSocket("udp4");
var fs = require('fs');
var crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;


var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character

function getDateTime() {

var date = new Date();

var hour = date.getHours();
hour = (hour < 10 ? "0" : "") + hour;

var min  = date.getMinutes();
min = (min < 10 ? "0" : "") + min;

var sec  = date.getSeconds();
sec = (sec < 10 ? "0" : "") + sec;

var year = date.getFullYear();

var month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;

var day  = date.getDate();
day = (day < 10 ? "0" : "") + day;

return year + "/" + month + "/" + day + " " + hour + ":" + min + ", ";

}

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

server.on("message", function (msg, rinfo) {
 var full_msg = String(msg);
 var hash = full_msg.substring(0,vars.hash_size);
 var sensors_msg =full_msg.substring(vars.hash_size,vars.hash_size+vars.msg_len);
 console.log(getDateTime() +  " from " +
 rinfo.address + ":" + rinfo.port);
 
 
 console.log("Remote hash (md5): "+hash);
 var string2hash =vars.secret_word+sensors_msg;
 var local_hash = crypto.createHash('md5').update(string2hash).digest('hex');
 local_hash = local_hash.substring(0,vars.hash_size);
 console.log("Local hash (md5): "+local_hash);
 if(local_hash==hash){
 	console.log("Valid Data!");
 	var data = sensorData.getSensorDataFromMsg(sensors_msg);
 	data.print();
 }
 else{
 console.log("Invalid Data!");	
 }
 fs.appendFile("mydata.txt",getDateTime() + msg + crlf, encoding='utf8',function(err){});//write the value to file and add CRLF for line break

});

server.on("listening", function () {
  var address = server.address();

  console.log("server listening " +
  address.address + ":" + address.port);
 });

server.bind(6000);
// server listening 10.0.0.13:6000
// Connect to the db
MongoClient.connect("mongodb://192.168.56.101:27017/test", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
    else
    {
        console.log( err);}
});
db.collection('test', function(err, collection) {});

