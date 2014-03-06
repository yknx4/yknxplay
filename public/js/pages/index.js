$(document).ready(function () {
    $.get("/sensor_data/month/1", {}, function (data) {
        var jData = JSON.parse(data);
        var fData = jData.sensordata;
        var values = new Array();

        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = (fData.sensorValues[i] / fData.count) * (1 + .4 * i);
        }
        console.log(fData);
        console.log(JSON.stringify(values));
        $('#testChartContainer').dxBarGauge({
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
                text: "Flujo de Agua",
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

        $("#duoChartContainer").dxChart({
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
                    name: "Sensor 1"
                },
                {
                    valueField: "s1",
                    name: "Sensor 2"
                },
                {
                    valueField: "s2",
                    name: "Sensor 3"
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
            title: "Flujo de Agua",
            commonPaneSettings: {
                border: {
                    visible: true,
                    bottom: false
                }
            }
        });

    }, "text");
});