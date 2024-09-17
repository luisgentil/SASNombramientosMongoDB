/*
Fecha: 05-03-2024
Versión: 1.0
Autor: LG
Resumen: 

*/

const fs = require('fs');
require('dotenv').config();
const RUTA_GRABAR_EN_BD = process.env['RUTA_GRABAR_EN_BD'];

function grabarEnBD(grabaEnBD) {

    // Guarda los resultados en un fichero:
      // Definir el nombre del archivo donde se guardará el resultado
      let file = RUTA_GRABAR_EN_BD;

      // Escribir el objeto JSON en el archivo con formato de cadena
      fs.writeFile(file, JSON.stringify(grabaEnBD, null, 2), (err) => {
        // Manejar el posible error al escribir el archivo
        if (err) {
          console.error(err);
        } else {
          // Mostrar un mensaje de éxito al escribir el archivo
          console.log(`El resultado se ha guardado en el archivo ${file}`);
        }
      });
    };

    module.exports.grabarEnBD = grabarEnBD ;
