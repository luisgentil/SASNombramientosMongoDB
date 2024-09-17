/*
Fecha: 05-03-2024
Autor: LG
Resumen: 
Otra cosnulta a Bing, un código node js para abrir un archivo con extensión json llamado "boja.json",  leer el contenido, y guardar el último registro en una variable llamada ultimo.
Version 2, 29/02/2024
Cambios en esta versión:
Corrige error si no existe el fichero
*/

// Importar el módulo necesario
const fs = require('fs');

function leerFichero(file) {
  if (fs.existsSync(file)) {
    // Leer el archivo de forma SINCRONA
    let archivo = fs.readFileSync(file, 'utf-8');
    // Parsear los datos a un objeto JSON
    let json = JSON.parse(archivo);
    // Obtener el último registro del objeto JSON
    let ultimo = json;
    
    // Mostrar el último registro por consola
    var ultimoN = ultimo.rows[ultimo.rows.length - 1];
    //console.log(file, ultimoN);
  }
  else {
    var ultimoN = [0, "14/04/1972"];
    // si no existe el fichero, lo crea
    fs.writeFileSync(file, JSON.stringify('vacío.'));
  }
  return ultimoN;
}

//console.log(leerFichero('boja.json'));

module.exports.leerFichero = leerFichero;
