// Basado en leerFichero.js, 
//un código node js para abrir un archivo con extensión json llamado "hallazgos.json", leer el contenido, y devolverlo.

// Importar el módulo necesario
const fs = require('fs');

function leerHallazgos(file) {
  // Leer el archivo de forma síncrona
  let archivo = fs.readFileSync(file, 'utf-8');
  // Parsear los datos a un objeto JSON
  let json = JSON.parse(archivo);

  return json;
}

//console.log(leerHallazgos('hallazgos.json'));

module.exports.leerHallazgos = leerHallazgos;
