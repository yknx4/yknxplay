$(document).ready(function () {
    $.get("/sensor_data/month/1", {}, function (data) {
        var fData = JSON.parse(data).sensordata;
        var values = new Array();
        for (var i = 0; i < fData.sensorValues.length; i++) {
            values[i] = (fData.sensorValues[i] / fData.count) * (1 + .33 * i);
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
    }, "text");
});