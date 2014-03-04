exports.defaultParams = {
    title: 'Water Flow',
    active: 'Home',
    links: [
        {
            name: 'Home',
            url: '/',
            class: 'fa fa-home'
        },
        {
            name: 'API',
            url: '/sensor_data/',
            class: 'fa fa-files-o'
        },
        {
            name: 'Charts',
            url: '/charts.html',
            class: 'fa fa-bar-chart-o'
        }
 ],
    upperHelper: function (string) {
        return string.toUpperCase();
    }
};
/*
<h2>Obtener el valor de una sola lectura: "/sensor_data/:id"</h2>
    <p>el parámetro :id toma como etrada el object_id de la lectura</p>
    <br/>
    <h2>Obtener toda la información en un mes: "/sensor_data/month/:month"</h2>
    <p>el parámetro :month es el valor numérico de un mes. Ej (Febrero). '/sensor_data/month/2'</p>
    <br/>
    <h2>Obtener toda la información para un día del mes actual: "/sensor_data/day/:day"</h2>
    <p>el parámetro :day es un día del mes. Ej (Dia 7). '/sensor_data/day/7' (Si se requiere un día específico de otro mes, se utiliza el estilo "full_date"</p>
    <br/>
    <h2>Obtener toda la información para un día del mes actual: "/sensor_data/day/:day"</h2>
    <p>el parámetro :low es la hora mas baja, y :high es la hora mas alta. Ej (Entre 7am y 2pm). '/sensor_data/hour_range/7/14'</p>
    <br/>
    <h2>Obtener toda la información entre 2 fechas: "/sensor_data/from_date/:low/to_date/:high"</h2>
    <p>el parámetro :low es la fecha mas baja, y :high es la fecha mas alta. Ej. '/sensor_data/full_date/1994-12-11-12-24-15/1995-1-5-10-20-22'</p>
    <p>la fecha se introduce con año, mes, día, hora, minuto, y segundo, con el formato AAAA-M-D-H-M-S. Ej (11/12/1994 12:24:15). 1994-12-11-12-24-15</p>
    <br/>
*/
exports.apiList = {
    list: [
        {
            header: 'Obtener el valor de una sola lectura: "/sensor_data/:id"',
            description: 'El parámetro :id toma como etrada el object_id de la lectura'
        },
        {
            header: 'Obtener toda la información en un mes: "/sensor_data/month/:month"',
            description: 'El parámetro :month es el valor numérico de un mes. Ej (Febrero). \'/sensor_data/month/2\''
        },
        {
            header: 'Obtener toda la información para un día del mes actual: "/sensor_data/day/:day"',
            description: 'El parámetro :day es un día del mes. Ej (Dia 7). \'/sensor_data/day/7\''
        },
        {
            header: 'Obtener toda la información para un día del mes actual: "/sensor_data/day/:day"',
            description: 'El parámetro :low es la hora mas baja, y :high es la hora mas alta. Ej (Entre 7am y 2pm). \'/sensor_data/hour_range/7/14\''
        },
        {
            header: 'Obtener toda la información entre 2 fechas: "/sensor_data/from_date/:low/to_date/:high"',
            description: 'El parámetro :low es la fecha mas baja, y :high es la fecha mas alta. Ej. \'/sensor_data/full_date/1994-12-11-12-24-15/1995-1-5-10-20-22\' <br/>La fecha se introduce con año, mes, día, hora, minuto, y segundo, con el formato AAAA-M-D-H-M-S. Ej (11/12/1994 12:24:15). 1994-12-11-12-24-15'
        }
 ]
};
