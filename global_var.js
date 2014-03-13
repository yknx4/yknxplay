exports.noOfSensors = 3;
exports.msgSize = 5;
exports.msg_len = exports.msgSize * exports.noOfSensors;
exports.hash_size = 16;
exports.secret_word = "S0*(dae{dse2";
//exports.dbName = "ucol_wflow";
exports.dbName = "UCOL_WFLOW";
exports.collectionName = 'sensorData';
//exports.dbServer = 'yknx4:konami1994@widmore.mongohq.com';
//exports.dbPort = "10000";
exports.dbServer = '127.0.0.1';
exports.dbPort = "27017";
//exports.siteServer = 'quiet-falls-5386.herokuapp.com';
//exports.sitePort = '80';
exports.siteServer = '127.0.0.1';
exports.sitePort = '3000';
exports.mergeJson = function () {
    var destination = {},
        sources = [].slice.call(arguments, 0);
    sources.forEach(function (source) {
        var prop;
        for (prop in source) {
            if (prop in destination && Array.isArray(destination[prop])) {

                // Concat Arrays
                destination[prop] = destination[prop].concat(source[prop]);

            } else if (prop in destination && typeof destination[prop] === "object") {

                // Merge Objects
                destination[prop] = merge(destination[prop], source[prop]);

            } else {

                // Set new values
                destination[prop] = source[prop];

            }
        }
    });
    return destination;
};