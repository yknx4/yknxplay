exports.parseDateInUrl = function (date) {
    var dateArray = date.split("-");
    //año,mes,dia,hora,minutos,segundos
    var finalDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    return finalDate;
};