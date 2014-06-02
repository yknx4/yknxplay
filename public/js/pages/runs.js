var cQ = 4.8;


function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function flowInLiters(reads, count) {
    return flowInLitersPerMinute(reads, count) * count * 2;
}

function flowInLitersPerMinute(reads, count) {
    if (count == 0) return 0;
    return ((reads / (count * 2))) / cQ;
}

function calculateRuns(avg, reads, count) {
    if (reads > avg)
        return 1;
    return 0;

}

function calculateRunswA(reads, count) {
    if (reads / count > 1)
        return 1;
    return 0;

}

$(document).ready(function () {


    var date = new Date();
    var year = GetURLParameter('year');
    if (year == "*") year = date.getFullYear();
    var month = GetURLParameter('month');
    if (month == "*") month = date.getMonth() + 1;
    var day = GetURLParameter('day');
    if (day == "*") day = date.getDate();

    /**OVERRIDE**/
    year = 2014;
    month = 5;
    day = 29;
    /*OVERRIDE*/

    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);




    console.log(year + " " + month + " " + day);





    $.get("/sensor_data/year/" + year + "/month/" + month + '/day/' + day, {}, function (data) {
        ////thisDayAvgChart
        var dateString = date.toString("MMMM") + " " + (date.getDate()) + ", " + date.getFullYear();
        $(".lastDayText").html(dateString);
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        var values = new Array();



        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = calculateRuns(fData.sensorValues[i], fData.count[i]);
        }
        console.log(fData);
        console.log(JSON.stringify(values));

        /*OTHER CHART*/
        var hoursData = fData.hours;
        var fDataC = new Array();
        var tmpDate = new Date();

        hoursData.forEach(function (val, index, arr) {


            //if (index > tmpDate.getHours()) return;
            //console.log("Hour: " + index);
            var vDate = index + 1;
            var avg = (calculateRunswA(val.sensorValues[0], val.count[0]) + calculateRunswA(val.sensorValues[1], val.count[1]) + calculateRunswA(val.sensorValues[2], val.count[2])) / 3;

            fDataC.push({
                year: JSON.stringify(vDate),
                s0: calculateRuns(avg, val.sensorValues[0], val.count[0]),
                s1: calculateRuns(avg, val.sensorValues[1], val.count[1]),
                s2: calculateRuns(avg, val.sensorValues[2], val.count[2]),
                avg: avg
            });
        });

        $("#flowLastDayChartContainer").dxChart({
            dataSource: fDataC,
            commonSeriesSettings: {
                type: "spline",
                argumentField: "year"
            },
            commonAxisSettings: {
                grid: {
                    visible: true
                }
            },
            series: [
                {
                    valueField: "s0",
                    name: "S1"
                },
                {
                    valueField: "s1",
                    name: "S2"
                },
                {
                    valueField: "s2",
                    name: "S3"
                },
                {
                    valueField: "avg",
                    name: "Average",
                    type: 'splinearea'
                }
    ],
            tooltip: {
                enabled: true
            },
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center"
            },
            title: "Runs Test",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });









    }, "text");

});