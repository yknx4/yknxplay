var dgram = require("dgram");
var sensorData = require("./sensordata");
var vars = require("../global_var");
var server = dgram.createSocket("udp4");
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');



var crlf = new Buffer(2);
crlf[0] = 0xD; //CR - Carriage return character
crlf[1] = 0xA; //LF - Line feed character



function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "/" + month + "/" + day + " " + hour + ":" + min + ", ";

}
exports.startUDPServer = function () {
    server.on("error", function (err) {
        console.log("server error:\n" + err.stack);
        server.close();
    });

    server.on("message", function (msg, rinfo) {
        var full_msg = String(msg);
        var hash = full_msg.substring(0, vars.hash_size);
        var sensors_msg = full_msg.substring(vars.hash_size, vars.hash_size + vars.msg_len);
        console.log(getDateTime() + " from " +
            rinfo.address + ":" + rinfo.port);


        console.log("Remote hash (md5): " + hash);
        var string2hash = vars.secret_word + sensors_msg;
        var local_hash = crypto.createHash('md5').update(string2hash).digest('hex');
        local_hash = local_hash.substring(0, vars.hash_size);

        var data = sensorData.getSensorDataFromMsg(sensors_msg);
        data.print();

        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        var options = {
            host: '127.0.0.1',
            port: '3000',
            path: '/sensor_data/create/' + full_msg
        };

        callback = function (response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                console.log(str);
            });
        }

        http.request(options, callback).end();

        fs.appendFile("requests.txt", getDateTime() + msg + crlf, encoding = 'utf8', function (err) {}); //write the value to file and add CRLF for line break

    });

    server.on("listening", function () {
        var address = server.address();

        console.log("UDP server listening " +
            address.address + ":" + address.port);

    });
    server.bind(6000);
}
// server listening 10.0.0.13:6000
// Connect to the db
//MongoClient.connect("mongodb://192.168.56.101:27017/" + vars.dbName, function (err, db) {


/* db.ensureIndex('more_complex_ensure_index_test', {a:1, b:1}
        , {unique:true, background:true, dropDups:true, w:1}, function(err, indexName) {
*/