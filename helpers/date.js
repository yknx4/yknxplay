exports.parseDateInUrl = function (date) {
    var dateArray = date.split("-");
    //año,mes,dia,hora,minutos,segundos
    var finalDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    return finalDate;
};

exports.getDateTime = function () {

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
exports.daysInMonth = function (month, year) {
    return new Date(year, month - 1, 0).getDate();
}