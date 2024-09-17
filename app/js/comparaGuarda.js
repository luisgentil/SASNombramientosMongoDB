/*
Fecha: 11-06-2024
Versión: 2.1
Autor: LG
Resumen: 
ANTIGUO [- abrir un archivo con extensión json llamado "boja.json", donde se ha guardado la descarga de la consulta al API BOJA, leer el contenido, y guardar el último registro en una variable llamada ultimo.]
- abrir un archivo llamado "ultimo.json", lee y guarda el último registro en una variable llamada anterior.
- si son iguales, la variable respuesta = "Sin novedad."
- si son distintos, respuesta = "hay un BOJA nuevo", y copia/guarda el fichero boja.json como ultimo.json
*/

// Importar módulos necesarios
const fs = require('fs').promises;
const leerFichero = require('./leerFichero.js');


// función para leer el contenido de los ficheros
function comparaGuarda(file1, file2, ultimoNN) {

  // Leer el archivo último publicado
 // var ultimoN = leerFichero.leerFichero(file1);
  ultimoN = leerFichero.leerFichero(file1); // Object.values(ultimoNN); //ultimoNN debe ser un objeto con dos campos: boja, fecha
  console.log('ultimo ', ultimoN);
  
  // leer también el anterior
  var anteriorN = Object.values(ultimoNN); //ultimoNN debe ser un objeto con dos campos: boja, fecha  //leerFichero.leerFichero(file2);
  console.log('anterior ', anteriorN);
  console.log('numeroPublicados:', Object.values(ultimoNN)); // pasar de Objeto a Array ERROR SEGUIR AQUI

  console.log('Iguales:', (ultimoN[0] === anteriorN[0]));

  // compara
  if (ultimoN[0] === anteriorN[0]) {
    var respuesta = ["Sin novedad.", ultimoN[0]];
  } else {
    var respuesta = ["hay un BOJA nuevo: ", ultimoN[0]];
    
    // actualiza el fichero anterior.json que ahora debe contener también el nº new
     try {
      fs.copyFile(file1, file2);
      console.log('Archivo copiado exitosamente.');
    } catch (error) {
      console.error('Error al copiar el archivo.', error);
    }
  }  // fin del else
 console.log(respuesta);
  return respuesta;

} // fin function

//console.log(comparaGuarda('../data/boja.json', '../data/ultimo.json'));

module.exports.comparaGuarda = comparaGuarda;
