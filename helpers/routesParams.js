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

var ex1 = {
    "_id": "53169d9041f00f181b90b0a3",
    "__v": 0,
    "date": "2014-03-17T01:50:00.000Z",
    "sensorValues": [
    "3766",
    "0094",
    "3484"
  ]

};

var ex2 = {
    "sensordata": {
        "date": "2014-02-01T06:00:00.000Z",
        "count": 48247,
        "sensorValues": [
      241041386,
      241600672,
      241359893
    ],
        "days": [
            {
                "date": "2014-02-01T06:00:00.000Z",
                "count": 5340,
                "sensorValues": [
          8935922,
          9047416,
          8782876
        ]
      },
            {
                "date": "2014-02-12T06:00:00.000Z",
                "count": 5355,
                "sensorValues": [
          9039812,
          8736961,
          8847353
        ]
      }
    ]
    }
};

var ex3 = {
    "sensordata": {
        "date": "2014-03-07T06:00:00.000Z",
        "count": 1773,
        "sensorValues": [
      8869915,
      9069631,
      8879653
    ],
        "hours": [
            {
                "date": "2014-03-07T07:00:00.000Z",
                "count": 231,
                "sensorValues": [
          392455,
          379485,
          423907
        ]
      },
            {
                "date": "2014-03-08T05:00:00.000Z",
                "count": 246,
                "sensorValues": [
          332134,
          420830,
          371568
        ]
      }
    ]
    }
};
var ex4 = {
    "sensordata": {
        "date": "2014-01-07T06:00:00.000Z",
        "count": 1751,
        "sensorValues": [
      8634184,
      8896086,
      8637257
    ],
        "hours": [
            {
                "date": "2014-01-07T07:00:00.000Z",
                "count": 219,
                "sensorValues": [
          374909,
          398473,
          335731
        ]
      },
            {
                "date": "2014-01-08T05:00:00.000Z",
                "count": 213,
                "sensorValues": [
          404092,
          354073,
          331230
        ]
      }
    ]
    }
};
var ex5 = {
    "sensordata": [
        {
            "_id": "5316a03941f00f181b91f8cc",
            "__v": 0,
            "date": "2014-03-03T13:01:00.000Z",
            "sensorValues": [
        "5992",
        "7777",
        "4870"
      ]
    },
        {
            "_id": "5316a22841f00f181b92f9a4",
            "__v": 0,
            "date": "2014-03-03T13:01:00.000Z",
            "sensorValues": [
        "5019",
        "0463",
        "1612"
      ]
    },
        {
            "_id": "53169e2241f00f181b90ed7b",
            "__v": 0,
            "date": "2014-03-03T13:02:00.000Z",
            "sensorValues": [
        "4836",
        "1946",
        "8815"
      ]
    },
        {
            "_id": "5316a38941f00f181b93afb0",
            "__v": 0,
            "date": "2014-03-03T13:03:00.000Z",
            "sensorValues": [
        "5305",
        "3231",
        "7838"
      ]
    },
        {
            "_id": "53169ef841f00f181b915c72",
            "__v": 0,
            "date": "2014-03-03T13:04:00.000Z",
            "sensorValues": [
        "1724",
        "2550",
        "4325"
      ]
    },
        {
            "_id": "53169f7241f00f181b919b43",
            "__v": 0,
            "date": "2014-03-03T13:04:00.000Z",
            "sensorValues": [
        "1781",
        "3775",
        "6685"
      ]
    },
        {
            "_id": "5316a13841f00f181b927d0f",
            "__v": 0,
            "date": "2014-03-03T13:04:00.000Z",
            "sensorValues": [
        "8547",
        "6360",
        "6955"
      ]
    },
        {
            "_id": "5316a20d41f00f181b92ebaf",
            "__v": 0,
            "date": "2014-03-03T13:04:00.000Z",
            "sensorValues": [
        "5813",
        "0112",
        "9822"
      ]
    },
        {
            "_id": "53169f4141f00f181b918232",
            "__v": 0,
            "date": "2014-03-03T13:05:00.000Z",
            "sensorValues": [
        "2015",
        "7242",
        "9062"
      ]
    },
        {
            "_id": "53169e6541f00f181b911050",
            "__v": 0,
            "date": "2014-03-03T13:07:00.000Z",
            "sensorValues": [
        "4059",
        "2515",
        "7863"
      ]
    },
        {
            "_id": "53169ec041f00f181b913eec",
            "__v": 0,
            "date": "2014-03-03T13:07:00.000Z",
            "sensorValues": [
        "7054",
        "4632",
        "9449"
      ]
    },
        {
            "_id": "53169faf41f00f181b91b096",
            "__v": 0,
            "date": "2014-03-03T13:07:00.000Z",
            "sensorValues": [
        "4252",
        "7126",
        "2957"
      ]
    }
  ]
};
exports.apiList = {
    list: [
        {
            header: 'Obtener el valor de una sola lectura: " /sensor_data/:id "',
            description: 'El parámetro :id toma como etrada el object_id de la lectura',
            //example: "{\n\"_id\": \"53169d9041f00f181b90b0a3\",\n\"__v\": 0,\n\"date\": \"2014-03-17T01:50:00.000Z\",\n\"sensorValues\": [\n\"3766\",\n\"0094\",\n\"3484\"\n]\n}"
            example: JSON.stringify(ex1, null, 2)
        }
    ,
        {
            header: 'Obtener toda la información en un mes: " /sensor_data/month/:month "',
            description: 'El parámetro :month es el valor numérico de un mes. Ej (Febrero). \'/sensor_data/month/2\' <br/> (Ejemplo reducido)',
            example: JSON.stringify(ex2, null, 2)
    },
        {
            header: 'Obtener toda la información para un día del mes actual: " /sensor_data/day/:day "',
            description: 'El parámetro :day es un día del mes. Ej (Dia 7). \'/sensor_data/day/7\'<br/> (Ejemplo reducido)',
            example: JSON.stringify(ex3, null, 2)
    },
        {
            header: 'Obtener toda la información para un día de un mes: " /sensor_data/month/:month/day/:day "',
            description: 'El paramentro :month es el número del mes, y el parámetro :day es un día del mes. Ej (Mes Enero, Dia 7). \'/sensor_data/month/1/day/7\'<br/> (Ejemplo reducido)',
            example: JSON.stringify(ex4, null, 2)
    },
        {
            header: 'Obtener toda la información para un rango de horas del día: " /sensor_data/from_hour/:low/to_hour/:high "',
            description: 'El parámetro :low es la hora mas baja, y :high es la hora mas alta. Ej (Entre 7am y 2pm). \'/sensor_data/from_hour/7/to_hour/14\'<br/> (Ejemplo reducido)',
            example: JSON.stringify(ex5, null, 2)
    },
        {
            header: 'Obtener toda la información entre 2 fechas: " /sensor_data/from_date/:low/to_date/:high "',
            description: 'El parámetro :low es la fecha mas baja, y :high es la fecha mas alta. Ej. \'/sensor_data/from_date/1994-12-11-12-24-15/to_date/1995-1-5-10-20-22\' <br/>La fecha se introduce con año, mes, día, hora, minuto, y segundo, con el formato AAAA-M-D-H-M-S. Ej (11/12/1994 12:24:15). 1994-12-11-12-24-15<br/><br/><span class="label label-warning">Máximo 7 días</span>',
            example: JSON.stringify(ex5, null, 2)
    }
        ]
};
