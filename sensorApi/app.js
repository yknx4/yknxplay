/**
 * Module dependencies.
 */
var vars = require("./global_var");
exports.globar_vars = vars;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sensor_data = require('./routes/sensor_data');
var mongoose = require('mongoose');
//"mongodb://yknx4:konami1994@widmore.mongohq.com:10000/ucol_wflow"
//mongoose.connect("mongodb://192.168.56.101:27017/" + vars.dbName);
mongoose.connect("mongodb://yknx4:konami1994@widmore.mongohq.com:10000/ucol_wflow");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/sensor_data', sensor_data.index);
app.get('/sensor_data/:id', sensor_data.show);
app.get('/sensor_data/from_date/:low/to_date/:high', sensor_data.showByDateRange);
app.get('/sensor_data/month/:month', sensor_data.showByMonth);
app.get('/sensor_data/day/:day', sensor_data.showByDay);
app.get('/sensor_data/from_hour/:low/to_hour/:high', sensor_data.showByHourRange);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});