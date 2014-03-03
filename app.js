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
var udpServer = require("./udpServer/listener");
var engine = require('ejs-locals');


//"mongodb://yknx4:konami1994@widmore.mongohq.com:10000/ucol_wflow"
//mongoose.connect("mongodb://192.168.56.101:27017/" + vars.dbName);
mongoose.connect("mongodb://" + vars.dbServer + ":" + vars.dbPort + "/" + vars.dbName);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.engine('ejs', engine);
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

//app.get('/', routes.index);

app.get('/', function (req, res) {
    res.render('index', {
        modernizr: "javascripts/libs/modernizr-2.0.6.min.js",
        jquery: "javascripts/libs/jquery-1.7.2.min.js",
        title: 'JSON Api for Water Flow data',
        description: 'this is a description',
        javascripts: ["javascripts/script.js", "javascripts/bootstrap.js"],
        stylesheets: ["bootstrap.css", "bootstrap-theme.css", "sb-admin.css"]
    });
});


app.get('/users', user.list);
app.get('/sensor_data', sensor_data.index);
app.get('/sensor_data/create/:msg', sensor_data.create);
app.get('/sensor_data/:id', sensor_data.show);
app.get('/sensor_data/from_date/:low/to_date/:high', sensor_data.showByDateRange);
app.get('/sensor_data/month/:month', sensor_data.showByMonth);
app.get('/sensor_data/day/:day', sensor_data.showByDay);
app.get('/sensor_data/from_hour/:low/to_hour/:high', sensor_data.showByHourRange);

app.use(function (req, res, next) {
    // the status option, or res.statusCode = 404
    // are equivalent, however with the option we
    // get the "status" local available as well
    res.render('404', {
        layout: false,
        status: 404,
        //url: req.url,
        title: '404 Error'
    });
});

app.use(function (err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.render('500', {
        layout: false,
        status: err.status || 500,
        error: err,
        title: '500 Error'
    });
});
//Add input from get petition


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server (JSON API) listening on port ' + app.get('port'));
});
udpServer.startUDPServer();