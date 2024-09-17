/*
Fecha: 05-03-2024
Versión: 1.0
Autor: LG
Resumen: 

*/

const enviaMensaje = require('./enviarMensaje.js');
const consultaApi = require('./consultaApiBoja.js');
const comparaGuarda = require('./comparaGuarda.js');
const buscarNombramientoBoja3 = require('./scraperBoja3.js');
const leerHallazgos = require('./leerHallazgos.js');
require('dotenv').config();
const grabarEnBD = require('./grabarEnBD.js');
const funcionesBD = require('./funcionesBD.js');

const RUTA_HALLAZGOS = process.env['RUTA_HALLAZGOS'];
const RUTA_BOJA_JSON = process.env['RUTA_BOJA_JSON'];
const RUTA_ULTIMO_JSON = process.env['RUTA_ULTIMO_JSON'];

async function funcionesCron(ultimoN) {
    var organismoPrincipal = process.env['ORGANISMO_PRINCIPAL']; 
    var organismoSecundario = process.env['ORGANISMO_SECUNDARIO'];
    
    ////////////////////////////////////
    // esta función actualiza el listado de nº-fecha disponible en la Api Boja, y lo guarda en el fichero boja.json
    setTimeout(() => {
        console.log("Primer cron");
        consultaApi.consultaApi();
        console.log("Archivo descargado.");
    }, 500);
    
    setTimeout( () => {
        console.log('Este es un 2º trabajo de cron.');
        //console.log('UltimoN en funcC 2º:', ultimoN);
        actualiza = comparaGuarda.comparaGuarda(RUTA_BOJA_JSON, RUTA_ULTIMO_JSON, ultimoN);
        console.log(actualiza);
        console.log(actualiza[0], 'BOJA nuevo:', actualiza[0] == 'hay un BOJA nuevo: ');
        if (actualiza[0] == 'hay un BOJA nuevo: ') {
        enviaMensaje.enviaMensaje(actualiza[0] + actualiza[1]);
        }
    }, 10000);

    setTimeout(() => {
        numBoja = actualiza[1];
        console.log('Este es un tercer trabajo de cron.', numBoja.toString());
        try {
        novedad = buscarNombramientoBoja3.buscarNombramientoBoja3(organismoPrincipal, organismoSecundario, numBoja.toString());
        }
        catch (err) { console.log(err); }
       // finally { console.log(3); }
    }, 20000);

    setTimeout(() => {
        console.log('Este es un 4º trabajo de cron.', actualiza[0], numBoja.toString());
        console.log(4, 'Enviar mensaje:', actualiza[0] == 'hay un BOJA nuevo: ');
        novedad = leerHallazgos.leerHallazgos(RUTA_HALLAZGOS);
        if (actualiza[0] == 'hay un BOJA nuevo: ') {
        enviaMensaje.enviaMensaje(novedad.toString());
        }
    }, 30000);

    setTimeout(() => {
        console.log('Este es un 5º trabajo de cron.', actualiza[0]);
        var HayQueGrabar = (actualiza[0] == 'hay un BOJA nuevo: '); // puede ser true or false
        console.log(5, 'Grabar:', HayQueGrabar);
        if (actualiza[0] == 'hay un BOJA nuevo: ') {
            var grabaEnBD = true;}
        else { var grabaEnBD = false;}
        grabarEnBD.grabarEnBD(grabaEnBD);
       // grabacionFinal = funcionesBD.insertarVariosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
    }, 40000);

    ////////////////////////////////////
}

module.exports.funcionesCron = funcionesCron;