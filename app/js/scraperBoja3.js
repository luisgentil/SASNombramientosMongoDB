// basado en consultaApi.js

const https = require('https');
const fs = require('fs');
require('dotenv').config();

const RUTA_HALLAZGOS = process.env['RUTA_HALLAZGOS'];

// Importar los módulos necesarios
function buscarNombramientoBoja3(organismoPrincipal, organismoSecundario, numBoja) {

  var hallazgos = [];
  // Definir la url de la api de Boja
  const urlCompuesta = 'https://datos.juntadeandalucia.es/api/v0/boja/search?titleSec=2. Autoridades y personal&organisation=' + organismoPrincipal + '&type=-&subtitle=2.1.%20Nombramientos%2C%20situaciones%20e%20incidencias&version=-&order_by=id&mode=ASC&format=json&size=0&year=2024&number=' + numBoja;
  console.log(urlCompuesta);
  //  const urlCompuesta = 'https://datos.juntadeandalucia.es/api/v0/boja/search?titleSec=2.%20Autoridades%20y%20personal&organisation=' + 'Consejer%C3%ADa%20de%20Salud%20y%20Consumo' + '&type=-&subtitle=2.1.%20Nombramientos%2C%20situaciones%20e%20incidencias&version=-&order_by=id&mode=ASC&format=json&size=0&year=2023&number=' + numBoja;
  //  const urlCompuesta = 'https://datos.juntadeandalucia.es/api/v0/boja/search?titleSec=2.%20Autoridades%20y%20personal&organisation=Consejer%C3%ADa%20de%20Empleo%2C%20Empresa%20y%20Trabajo%20Aut%C3%B3nomo&type=-&subtitle=2.1.%20Nombramientos%2C%20situaciones%20e%20incidencias&version=-&order_by=id&mode=ASC&format=json&size=0&year=2023&number=' + numBoja;

  // Hacer una petición GET a la url
  https.get(urlCompuesta, (res) => {
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
      // Si el Boja incluye algún nombramiento del Org. Pral, la respuesta http tendrá contenido y el status = 200
      if (res.statusCode == 200) {
        // Revisa todos los resultados, para comprobar si hay alguno del Organismo Secundario
        json.results.forEach(element => {
          resultado = element.summaryNoHtml;
          if (resultado.toLowerCase().includes(organismoSecundario)) {
            hallazgos.push(resultado);
            hallazgos.push('\n');
          }
          // Caso que no haya ningún resultado del organismo secundario:
          // if (hallazgos.length < 1) { hallazgos.push('Sin novedad.'); }
        });
        if (hallazgos.length < 1) { hallazgos.push('Sin novedad.') };
        console.log("hallazgos: ", hallazgos);
        // Si no hay publicaciones del org pral, el status = 400
      } else {
        console.log("Status:", res.statusCode);
        hallazgos.push('Sin novedad.');
      }
      // Guarda los resultados en un fichero:
      // Definir el nombre del archivo donde se guardará el resultado
      let file = RUTA_HALLAZGOS;

      // Escribir el objeto JSON en el archivo con formato de cadena
      fs.writeFile(file, JSON.stringify(hallazgos, null, 2), (err) => {
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

//a = buscarNombramientoBoja3('consejería de empleo, empresa y trabajo autónomo', 'servicio andaluz de empleo', 95);
/*setTimeout (() => {
  console.log((a));
}, 6000);
*/
module.exports.buscarNombramientoBoja3 = buscarNombramientoBoja3;

