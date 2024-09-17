/*
Fecha: 05-03-2024
Versión: 1.0
Autor: LG
Resumen: 
un código node js para hacer una cosulta a la api de Boja, 'https://datos.juntadeandalucia.es/api/v0/boja/get/calendar', y guardar el resultado en un archivo con extensión json
*/

// Importar los módulos necesarios
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const RUTA_BOJA_JSON = process.env['RUTA_BOJA_JSON'];

function consultaApi() {
  // Definir la url de la api de Boja
  const url = 'https://datos.juntadeandalucia.es/api/v0/boja/get/calendar';

  // Hacer una petición GET a la url
  https.get(url, (res) => {
  // Inicializar una variable para almacenar los datos recibidos
    let data = '';

    // Escuchar el evento 'data' y concatenar los datos recibidos
    res.on('data', (chunk) => {
      data += chunk;
    });

    // Escuchar el evento 'end' y procesar los datos recibidos
    res.on('end', () => {
      // Parsear los datos a un objeto JSON
      let json = JSON.parse(data);

      // Definir el nombre del archivo donde se guardará el resultado
      let file = RUTA_BOJA_JSON;

      // Escribir el objeto JSON en el archivo con formato de cadena
      fs.writeFile(file, JSON.stringify(json, null, 2), (err) => {
        // Manejar el posible error al escribir el archivo
        if (err) {
          console.error(err);
        } else {
          // Mostrar un mensaje de éxito al escribir el archivo
          console.log(`El resultado se ha guardado en el archivo ${file}`);
        }
      });
    });
  }).on('error', (err) => {
    // Manejar el posible error al hacer la petición
    console.error(err);
  });
}

module.exports.consultaApi = consultaApi;
