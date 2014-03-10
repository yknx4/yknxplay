/**
 * Module dependencies.
 */
var vars = require("./global_var");
var routesParams = require("./helpers/routesParams");
var queryCache = require("./helpers/queryCache");
exports.globar_vars = vars;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var sensor_data = require('./routes/sensor_data');
var mongoose = require('mongoose');
var udpServer = require("./udpServer/listener");
//var engine = require('ejs-locals');
var ECT = require('ect');
var ectRenderer = ECT({
    watch: true,
    root: __dirname + '/views'
});

mongoose.connect("mongodb://" + vars.dbServer + ":" + vars.dbPort + "/" + vars.dbName);

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ect');

//app.engine('ect', engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('.ect', ectRenderer.render);
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

function getPageParams(name) {
    var def = routesParams.defaultParams();
    var read = JSON.parse(fs.readFileSync('./configs/pages/' + name + '.json', 'utf8'));
    read.title = def.title + ' - ' + read.title;
    return vars.mergeJson(def, read);
}


app.get('/', function (req, res) {
    var d = getPageParams('index');
    res.render(d.page_file, d);
});

app.get('/sensor_data', function (req, res) {
    var d = getPageParams('api');
    res.render(d.page_file, d);
});

app.get('/users', user.list);
//app.get('/sensor_data', sensor_data.index);
app.get('/sensor_data/create/:msg', sensor_data.create);
app.get('/sensor_data/:id', sensor_data.show);
app.get('/sensor_data/from_date/:low/to_date/:high', sensor_data.showByDateRange);
app.get('/sensor_data/year/:year/month/:month', sensor_data.showByMonthParsed);
app.get('/sensor_data/day/:day', sensor_data.showByDayParsed);
app.get('/sensor_data/year/:year/month/:month/day/:day', sensor_data.showByDayMonthParsed);
app.get('/sensor_data/from_hour/:low/to_hour/:high', sensor_data.showByHourRange);
//app.get('/sensor_data/day/:day', sensor_data.showByDay);
//app.get('/sensor_data/parsed/month/:month', sensor_data.showByMonthParsed);


//Add input from get petition


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server (JSON API) listening on port ' + app.get('port'));
});
udpServer.startUDPServer();
queryCache.doCache();
