var vars = require("../global_var");
var fs = require('fs');


exports.defaultParams = function () {
    return {
        title: 'Water Flow',
        active: 'Home',
        js: new Array(),
        css: new Array(),
        links: JSON.parse(fs.readFileSync('./configs/links.json', 'utf8')),
        upperHelper: function (string) {
            return string.toUpperCase();
        }
    };
}
