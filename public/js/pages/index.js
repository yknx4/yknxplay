$(document).ready(function () {
    var date = new Date();
    $.get("/sensor_data/year/" + date.getFullYear() + "/month/" + (date.getMonth() + 1), {}, function (data) {
        //October 1, 2013 - October 31, 2013
        var dateString = date.toString("MMMM") + ", " + date.getFullYear();
        $(".currMonthRange").html(dateString);
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        var values = new Array();

        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = (fData.sensorValues[i] / fData.count) * (1 + .4 * i);
        }
        console.log(fData);
        console.log(JSON.stringify(values));
        $('#avgMChartContainer').dxBarGauge({
            startValue: 0,
            endValue: 9999,
            values: values,
            label: {
                indent: 30,
                format: 'fixedPoint',
                precision: 1,
                customizeText: function (arg) {
                    return arg.valueText + ' u';
                }
            },
            title: {
                text: "Water flow",
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
            var avg = (val.sensorValues[0] + val.sensorValues[1] + val.sensorValues[2]) / 3;
            if (val.count > 0)
                fDataC.push({
                    year: JSON.stringify(vDate),
                    s0: val.sensorValues[0],
                    s1: val.sensorValues[1],
                    s2: val.sensorValues[2],
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
            title: "Water Flow",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });

    }, "text");

    $.get("/sensor_data/day/" + (date.getDate() - 1), {}, function (data) {
        var dateString = date.toString("MMMM") + " " + (date.getDate() - 1) + ", " + date.getFullYear();
        $(".lastDayText").html(dateString);
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        var values = new Array();

        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = (fData.sensorValues[i] / fData.count) * (1 + .4 * i);
        }
        console.log(fData);
        console.log(JSON.stringify(values));

        /*OTHER CHART*/
        var hoursData = fData.hours;
        var fDataC = new Array();


        hoursData.forEach(function (val, index, arr) {
            var vDate = index + 1;
            var avg = (val.sensorValues[0] + val.sensorValues[1] + val.sensorValues[2]) / 3;
            if (val.count > 0)
                fDataC.push({
                    year: JSON.stringify(vDate),
                    s0: val.sensorValues[0],
                    s1: val.sensorValues[1],
                    s2: val.sensorValues[2],
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
            title: "Water Flow",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });

    }, "text");

});
