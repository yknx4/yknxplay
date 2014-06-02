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

function calculateRuns(avg, reads) {
    //console.log("read: " + reads + " avg:" + avg);
    if (reads > avg)
        return 1;
    return -1;

}

function toDate(vDate) {
    //var tmpD = new Date(vDate * 60000);
    var tmpD = vDate;
    return tmpD.toLocaleTimeString();
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





    //$.get("/sensor_data/year/" + year + "/month/" + month + '/day/' + day, {}, function (data) {
    $.get("/sensor_data/from_date/" + year + "-" + month + "-" + day + "-0-0-0" + "/to_date/" + year + "-" + month + '-' + day + "-23-59-59", {}, function (data) {
        //http://127.0.0.1:3001/sensor_data/from_date/2014-5-29-0-0-0/to_date/2014-5-29-23-59-59
        ////thisDayAvgChart

        var dateString = date.toString("MMMM") + " " + (date.getDate()) + ", " + date.getFullYear();
        $(".lastDayText").html(dateString);
        var jData = JSON.parse(data);
        console.log(jData);
        var fData = jData.sensordata;
        console.log(fData);
        var values = new Array();



        /*for (var i = 0; i < fData.length; i++) {
            values[i] = calculateRuns(fData.sensorValues[i], fData.count[i]);
        }*/
        //console.log(fData);
        // console.log(JSON.stringify(values));

        /*OTHER CHART*/
        var hoursData = fData;
        var fDataC = new Array();
        var tmpDate = new Date();
        var avg = 0;
        var cnt = 0;
        fData.forEach(function (val, index, arr) {
            avg += (val.sensorValues[0] + val.sensorValues[1] + val.sensorValues[2]);
            cnt += 3;
        });
        avg /= cnt;

        var hCount = 0;
        var lastZero = false;
        fData.forEach(function (val, index, arr) {

            //console.log(val);
            //if (index > tmpDate.getHours()) return;
            //console.log("Hour: " + index);
            var vDate = index * 2;
            if ((index + 0) % 30 == 0) hCount++;

            //console.log(avg);
            tmpDate = new Date(val.date);
            //console.log(tmpDate);
            // console.log(hCount + ":" + vDate % 60);
            var s = calculateRuns(avg, val.sensorValues[0]) + calculateRuns(avg, val.sensorValues[1]) + calculateRuns(avg, val.sensorValues[2]);
            //if (s < 0) console.log(s);
            if (s != -3) lastZero = true;
            else lastZero = false;
            //if (lastZero)
            fDataC.push({
                //year: vDate + " minutes",
                year: toDate(tmpDate),
                s0: calculateRuns(avg, val.sensorValues[0]),
                s1: calculateRuns(avg, val.sensorValues[1]),
                s2: calculateRuns(avg, val.sensorValues[2]),
                avg: 0.1
            });


            //if (s < 0) console.log(s + " last0:" + lastZero);

        });
        console.log(fDataC);
        $("#runTest1").dxChart({
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
        $("#runTest2").dxChart({
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
                    valueField: "s1",
                    name: "S2"
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
        $("#runTest3").dxChart({
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