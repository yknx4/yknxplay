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


    console.log(year + " " + month + " " + day);



    $.get("/sensor_data/year/" + year + "/month/" + month, {}, function (data) {
        //October 1, 2013 - October 31, 2013
        var maxValue = 0;
        var minValue = 0;
        var dateString = date.toString("MMMM") + ", " + date.getFullYear();
        $(".currMonthRange").html(dateString);
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        minValue = flowInLitersPerMinute(fData.sensorValues[0], fData.count[0]);
        var values = new Array();
        var avg = 0;
        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = flowInLitersPerMinute(fData.sensorValues[i], fData.count[i]);
            if (values[i] > maxValue) maxValue = values[i];
            if (values[i] < minValue) minValue = values[i];
            avg += values[i];
        }
        avg /= fData.sensorValues.length;
        console.log("average= " + avg);
        console.log(fData);
        console.log(JSON.stringify(values));
        $('#avgMChartContainer').dxBarGauge({
            startValue: minValue / 2,
            endValue: maxValue * (1 + Math.random() / 4),
            values: values,
            label: {
                indent: 25,
                format: 'fixedPoint',
                precision: 1,
                customizeText: function (arg) {
                    var v = arg.value;
                    if (v < 1) {
                        return (v * 1000).toFixed(0) + ' mL/m';
                    }
                    return arg.valueText + 'L/m';
                }
            },
            title: {
                text: "Water flow per minute",
                font: {
                    size: 28
                }
            }
        });
        maxValue = 0;
        minValue = flowInLiters(fData.sensorValues[0], fData.count[0]);
        var valuesT = new Array();
        var totalAvg = 0;
        for (var i = 0; i < fData.sensorValues.length; i++) {
            valuesT[i] = flowInLiters(fData.sensorValues[i], fData.count[i]);
            if (valuesT[i] > maxValue) maxValue = valuesT[i];
            if (valuesT[i] < minValue) minValue = valuesT[i];
            totalAvg += valuesT[i];
        }
        totalAvg /= fData.sensorValues.length;
        $('#totalMChartContainer').dxBarGauge({
            startValue: minValue / 2,
            endValue: maxValue * (1 + Math.random() / 4),
            values: valuesT,
            label: {
                indent: 25,
                format: 'fixedPoint',
                precision: 1,
                customizeText: function (arg) {
                    console.log(arg);
                    var v = arg.value;
                    if (v > 1000) {
                        return (v / 1000).toFixed(2) + ' kL';
                    }
                    return arg.valueText + ' L';
                }
            },
            title: {
                text: "Total water flow",
                font: {
                    size: 28
                }
            }
        });
        /*OTHER CHART*/
        var daysData = fData.days;
        var fDataC = new Array();


        daysData.forEach(function (val, index, arr) {
            var vDate = index + 1;
            var avg = (flowInLiters(val.sensorValues[0], val.count[0]) + flowInLiters(val.sensorValues[1], val.count[1]) + flowInLiters(val.sensorValues[2], val.count[2])) / 3;
            //avg *= 720;

            fDataC.push({
                year: JSON.stringify(vDate),
                s0: (flowInLiters(val.sensorValues[0], val.count[0])),
                s1: (flowInLiters(val.sensorValues[1], val.count[1])),
                s2: (flowInLiters(val.sensorValues[2], val.count[2])),
                avg: avg
            });
        });

        $("#flowpdChartContainer").dxChart({
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
            title: "Water Flow per day",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });

    }, "text");

    $.get("/sensor_data/year/" + year + "/month/" + month + '/day/' + day, {}, function (data) {
        ////thisDayAvgChart
        var dateString = date.toString("MMMM") + " " + (date.getDate()) + ", " + date.getFullYear();
        $(".lastDayText").html(dateString);
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        var values = new Array();



        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = flowInLiters(fData.sensorValues[i], fData.count[i]);
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
            var avg = (flowInLiters(val.sensorValues[0], val.count[0]) + flowInLiters(val.sensorValues[1], val.count[1]) + flowInLiters(val.sensorValues[2], val.count[2])) / 3;

            fDataC.push({
                year: JSON.stringify(vDate),
                s0: flowInLiters(val.sensorValues[0], val.count[0]),
                s1: flowInLiters(val.sensorValues[1], val.count[1]),
                s2: flowInLiters(val.sensorValues[2], val.count[2]),
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
            title: "Water Flow in this day",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });

        var valuesVel = new Array();
        var minValue = flowInLitersPerMinute(fData.sensorValues[0], fData.count[0]);
        var maxValue = 0;


        for (var i = 0; i < fData.sensorValues.length; i++) {
            valuesVel[i] = flowInLitersPerMinute(fData.sensorValues[i], fData.count[i]);
            if (valuesVel[i] > maxValue) maxValue = valuesVel[i];
            if (valuesVel[i] < minValue) minValue = valuesVel[i];
        }


        $('#thisDayAvgChart ').dxBarGauge({
            startValue: minValue / 2,
            endValue: maxValue * (1 + Math.random() / 4),
            values: valuesVel,
            label: {
                indent: 25,
                format: 'fixedPoint',
                precision: 1,
                customizeText: function (arg) {
                    console.log(arg);
                    var v = arg.value;
                    if (v < 1) {
                        return (v * 1000).toFixed(0) + ' mL/m';
                    }
                    return arg.valueText + ' L/m';
                }
            },
            title: {
                text: "Water flow per minute",
                font: {
                    size: 28
                }
            }
        });









    }, "text");

});