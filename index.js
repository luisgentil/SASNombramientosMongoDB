/* Archivo principal del proyecto. 
  * Fecha: 17-06-2024
 * Versión: 2.1.2
 * Autor: LG
 * Esta app se encarga de revisar el BOJA, comprobar si hay nombramientos para un determinado organismo (por ejemplo SAS), grabar los hallazgos (o su ausencia) en una BD en MongoDB, y comunicarlos en un grupo de Telegram.
 * Versión genérica, los organismos se especifican en el archivo .env correspondiente.
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');

const funcionesCron = require('./app/js/funcionesCron.js');
const funcionesBD = require('./app/js/funcionesBD.js');

const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
require('dotenv').config();
const exphbs = require('express-handlebars');
const cron = require('node-cron');

const PORT = process.env.PORT || 3000;

const DB_URL = process.env['DB_URL'];
const DB_NOMBRE = process.env['DB_NOMBRE'];
const DB_COLECCION_PRAL = process.env['DB_COLECCION_PRAL'];
const DB_COLECCION_SEC = process.env['DB_COLECCION_SEC'];
var numBoja = 0;
// La BD se conecta en local o en Atlas (online)
const client = new mongo(DB_URL);
client.connect();
const coleccionOrganismos = client.db(DB_NOMBRE).collection(DB_COLECCION_PRAL);
const coleccionNombramientos = client.db(DB_NOMBRE).collection(DB_COLECCION_SEC);

const app = express();
const jsonParser = bodyParser.json();

////// PLANTILLAS ////////////
// Esto quizás haya que trasladarlo a un nuevo módulo, más adelante
//This loads all of the static files inside of the public folder. I.e, my css folder, my img folder and my js folder 
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) =>{
    res.locals.test = req.flash('test');
    next();
});

//This tells xpress to set handlebars as it's template engine which is then used to build the various views for the web page(s)
app.engine('handlebars', exphbs.engine()); // en origen ponía sólo exphbs, añadi .engine
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

////// NUEVAS RUTAS ////////////

////// ANTIGUAS RUTAS ////////////
/////// organismos disponibles en la BD, que puede almacenar varios  ///////////
app.get('/organismos', (req, res) => {
    return funcionesBD.obtenerOrganismos(coleccionOrganismos, ObjectId, req, res);
});
////////// INSERTAR Nombramientos de un organismo //////////////////////
app.post('/organismos/:organismoId/nombramientos', jsonParser, (req, res) => { 
    return funcionesBD.insertarNombramiento(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
});
////////// LEER Nombramientos de un organismo por su  _id //////////////////////
app.get('/organismos/:organismoId/nombramientos', (req, res) => {
    return funcionesBD.obtenerNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
});

////////// LEER Nombramientos  //////////////////////
app.get('/nombramientos', (req, res) => { 
    res.send("Nombramientos. pendienet");
});

app.get('/ultimosnombramientos', (req, res) => { 
    res.send("Ultimos Nombramientos. pendienet");
});

app.get('/todosnombramientos', (req, res) => { 
    res.send("Página de todos las publicaciones. pendienet");
});
////////// LEER Nombramientos de un organismo por NOMBRE CORTO //////////////////////
app.get('/nombramientos/:nombre', (req, res) => {
    return funcionesBD.obtenerNombramientosXNombre(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
});
app.get('/ultimosnombramientos/:nombre', (req, res) => {
   return funcionesBD.ultimosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
});

////////// Revisión del BOJA y todo el proceso posterior. /////////
app.get('/boja', async (req, res) => {
  try {
      // Realiza una consulta a la base de datos (aquí asumimos que ya tienes datos)
      const ultimoBoja = await funcionesBD.consultaUltimoBoja(coleccionNombramientos, ObjectId, res);
      if (ultimoBoja) {
          console.log('ultimoBoja.boja: ', (ultimoBoja) );
          // Si hay un resultado, redirige a /consulta/resultadobd
          //res.redirect(`/boja/${JSON.stringify(ultimoBoja)}`);
          //const ultimoNparsed =JSON.parse((req.params.numBoja));
          //console.log('ultimoN: ', JSON.parse(req.params.numBoja));
          funcionesCron.funcionesCron(ultimoBoja);
          funcionesBD.insertarVariosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
          res.render('mantenimiento', { datos: ultimoBoja });
        } else {
          // Si no hay resultado, redirige a una página de error o maneja de otra manera
          res.redirect('/error');
        }
      } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.redirect('/error');
      }
});

////////// Revisión del BOJA y todo el proceso posterior. /////////
app.get('/boja/:numBoja', (req, res) => {
  const ultimoNparsed =JSON.parse((req.params.numBoja));
  console.log('ultimoN: ', JSON.parse(req.params.numBoja));
  funcionesCron.funcionesCron(ultimoNparsed);
  funcionesBD.insertarVariosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
  res.render('mantenimiento', { datos: ultimoNparsed });
});

// ////////// COPIA VERSIÓN ANTERIOR CRON PROPIO EN ESTE FICHERO Revisión del BOJA y todo el proceso posterior. /////////
// app.get('/boja', async (req, res) => {
//     try {
//         // Realiza una consulta a la base de datos (aquí asumimos que ya tienes datos)
//         const ultimoBoja = await funcionesBD.consultaUltimoBoja(coleccionNombramientos, ObjectId, res);
//         if (ultimoBoja) {
//             console.log('ultimoBoja.boja: ', (ultimoBoja) );
//             // Si hay un resultado, redirige a /consulta/resultadobd
//             res.redirect(`/boja/${JSON.stringify(ultimoBoja)}`);
//           } else {
//             // Si no hay resultado, redirige a una página de error o maneja de otra manera
//             res.redirect('/error');
//           }
//         } catch (error) {
//           console.error('Error al consultar la base de datos:', error);
//           res.redirect('/error');
//         }
// });
// ////////// Revisión del BOJA y todo el proceso posterior. /////////
// app.get('/boja/:numBoja', (req, res) => {
//     const ultimoNparsed =JSON.parse((req.params.numBoja));
//     console.log('ultimoN: ', JSON.parse(req.params.numBoja));
//     funcionesCron.funcionesCron(ultimoNparsed);
//     funcionesBD.insertarVariosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res);
//     res.render('mantenimiento', { datos: ultimoNparsed });
// });

/////////////    
///// OTRAS rutas ///////
app.get('/', (req, res) => {
    res.render("principal");
});
//////////////////
app.get('/consulta/', async (req, res) => {
    try {
        // Realiza una consulta a la base de datos (aquí asumimos que ya tienes datos)
        const resultadoConsulta = await funcionesBD.consultaUltimoBoja(coleccionNombramientos, res);

        if (resultadoConsulta) {
            console.log(resultadoConsulta.boja);
            // Si hay un resultado, redirige a /consulta/resultadobd
            res.redirect(`/consulta/${resultadoConsulta.boja}`);
          } else {
            // Si no hay resultado, redirige a una página de error o maneja de otra manera
            res.redirect('/error');
          }
        } catch (error) {
          console.error('Error al consultar la base de datos:', error);
          res.redirect('/error');
        }
});

// Ruta para /consulta/resultadobd
app.get('/consulta/:resultado', (req, res) => {
    const { resultado } = req.params;
    // Aquí puedes renderizar una vista o enviar una respuesta JSON con el resultado
    res.send('Resultado de la base de datos: ' + resultado);
  });
  //////////////////

  //About Us Route
app.get("/about", (req, res) => {
    //This is how you inject dynamic data(typically data from a database into your handlebars views)
    const eventTitle = "The launch of The Joker";
    const eventDescription = "This movie will be released in October 2019 and is about Batman's greatest villian ever, THE JOKER";
    /*
      When you want to pass dynamic data to a handlebars view, you must pass an OBJECT LITERAL.
      This object could contain any number of properties. Each property specify in the object can be accessed within the handlebars view
    */
    res.render("aboutUs", {
      eventT: eventTitle,
      eventD: eventDescription
    });
});

//Contact Us Route
app.get("/contactUs", (req, res) => {
    const products = [];
  
    //The following will inject the above array into the "contactUs" handlebars file
    res.render("contactUs", {
      prod: products
    }) 
});

app.get("/estadoBD", (req, res) => {
    return funcionesBD.estadoBD(coleccionNombramientos, ObjectId, req, res);
});

////Tarea de Cron //////////////
/*
 * * * * * *
  | | | | | |
  | | | | | day of week
  | | | | month
  | | | day of month
  | | hour
  | minute
  second ( optional )
*/
// Schedule tasks to be run on the server.
// Example from https://blog.logrocket.com/5-ways-make-http-requests-node-js/

// // CRON tarea 1 05:57:00 
// cron.schedule('57 4 * * *', function() {
//   (async () => {
//       try {
//           const res = await fetch('https://sas-nombramientos-pre.replit.app/boja');// SUSTITUIR POR VARIABLE .ENV
//           const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
//           console.log('Status Code:', res.status);
//           console.log('Date in Response header:', headerDate);

//       } catch (err) {
//           console.log(err.message); //can be console.error
//       }
//   })();
// });
// // CRON tarea 2 17:57:00 
// cron.schedule('57 15 * * *', function() {
//   (async () => {
//       try {
//           const res = await fetch('https://sas-nombramientos-pre.replit.app/boja'); // SUSTITUIR POR VARIABLE .ENV 
//           const headerDate = res.headers && res.headers.get('date') ? res.headers.get('date') : 'no response date';
//           console.log('Status Code:', res.status);
//           console.log('Date in Response header:', headerDate);

//       } catch (err) {
//           console.log(err.message); //can be console.error
//       }
//   })();
// });

////PRINCIPAL DEL SERVIDOR //////////////
app.listen(PORT, () => console.log('Servidor iniciado...'));
