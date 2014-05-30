$(document).ready(function () {

    var date = new Date();
    var year = GetURLParameter('year');
    if (year == "*") year = date.getFullYear();
    var month = GetURLParameter('month');
    if (month == "*") month = date.getMonth() + 1;
    var day = GetURLParameter('day');
    if (day == "*") day = date.getDate();

    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);

    $('#dp3').datepicker('update', day + '-' + month + '-' + year).on('changeDate', function (ev) {
        var nDate = ev.date.valueOf();
        console.log(nDate);
        nDate = new Date(nDate);
        console.log(nDate);
        nDate.setDate(nDate.getDate() + 1);

        window.location.href = window.location.href.replace(/[\?#].*|$/, "?year=" + nDate.getFullYear() + "&month=" + (nDate.getMonth() + 1) + "&day=" + (nDate.getDate()));
    });


}, "text");