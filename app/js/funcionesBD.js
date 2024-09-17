/*
Fecha: 17-06-2024
Versión: 2.3
Autor: LG
Resumen: 

*/
require('dotenv').config();
const fs = require('fs');
const organismo = process.env['ORGANISMO'];
const RUTA_GRABAR_EN_BD = process.env['RUTA_GRABAR_EN_BD'];

///////  pero se podrían usar más organismos
async function obtenerOrganismos(coleccionOrganismos, ObjectId, req, res) {
    try {
        const organismos = await coleccionOrganismos.find().sort({nombre: 1}).toArray();

        return res.render('organismos',{ prod: organismos}); 
       // res.status(200).json({
       //     success: true,
       //     organismos
        //})
    } catch (error) {
        console.log( error);
    } 
}

/////// Añdir un elemento a la lista de nombramientos de un organismo ///////////
async function insertarNombramiento(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res){
    try {
        if (!ObjectId.isValid(req.params.organismoId)) throw 'El organismo indicado no es válido.';
        const organismo = await coleccionOrganismos.findOne(new ObjectId(req.params.organismoId)); // añado new, 
        if (!organismo) throw 'No se ha encontrado el organismo indicado';        
        if (!req.body.hasOwnProperty('descripcion')) throw 'No se ha definido una descripción';
                if (!req.body.hasOwnProperty('fecha')) throw 'No se ha definido una fecha';
        
        // en insertOne también hay que añadir new
        await coleccionNombramientos.insertOne({
            organismoId: new ObjectId(req.params.organismoId),
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            boja: numBoja
        });
        
        return res.status(201).json({ success: true });
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error});
    } 
}
///// Para añadir VARIOS nombramientos a la colección/////////////
async function insertarVariosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res){
  //////// Ahora sólo un retarde de 5", porque se llama desde funcionesCron, antes era desde index, y hacía un retardo de 45" para dar tiempo a que descargue y analice el Boja ////////
  setTimeout(() => {
    // Comprueba si se ha dejado grabada (en fichero) la orden de grabar varios nombramientos.
    let archivo = fs.readFileSync(RUTA_GRABAR_EN_BD, 'utf-8');
    // Parsear los datos a un objeto JSON
    let json = JSON.parse(archivo);       
    var fechaAhora = new Date();
     
    // Si existe la orden, es true:
    if (json) {
         // Hay que cambiar el valor de grabarEnBD.json a false, después de leer y grabar en la BD
         // este setTimeout puede convertirse en una función, que se invoque desde un endpoint /boja/grabar o algo así,
         // al que se llega mediante el uso de next() desde /boja, tras funcionesCron().
     var variosNombramientos = [];
     novedad.forEach(element => {
        console.log('element', element);
        if (element.length > 3) {
            var nombramiento = {
                organismoId: new ObjectId(organismo),
                descripcion: element,
                fecha: fechaAhora,
                boja: numBoja
            }
         variosNombramientos.push(nombramiento);
        }
     });
    
     console.log('Nuevos nombramientos a grabar: ', variosNombramientos.length);
     if (variosNombramientos.length > 0){
         //return variosNombramientos;
       try {
        coleccionNombramientos.insertMany(variosNombramientos);
       // return res.status(201).json({ success: true });
        console.log('success: true');
        } catch (error) {
        console.log(error);
        //return res.status(400).json({ success: false, error});
        console.log(' success: false, error.');
        } 
    }
}
    else {console.log('Nada que grabar. Fin.')};
    // Devuelve una respuesta.
//res.send('Proceso de grabación terminado.' + numBoja);
console.log('Proceso de grabación terminado.' + numBoja);
    }, 45000);
}
///// Para añadir VARIOS nombramientos a la colección durante la REVISIÓN de varios números/////////////
async function insertarVariosNombramientos2(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res){
    //////// Hace un retardo de 45' para dar tiempo a que descargue y analice el Boja ////////
    setTimeout(() => {
      // Comprueba si se ha dejado grabada (en fichero ) la orden de grabar varios nombramientos.
      let archivo = fs.readFileSync(RUTA_GRABAR_EN_BD, 'utf-8');
      // Parsear los datos a un objeto JSON
      let json = JSON.parse(archivo);       
      //var fechaAhora = new Date();
       
      // Si existe la orden, es true:
      if (json) {
           // Hay que cambiar el valor de grabarEnBD.json a false, después de leer y grabar en la BD
           // este setTimeout puede convertirse en una función, que se invoque desde un endpoint /boja/grabar o algo así,
           // al que se llega mediante el uso de next() desde /boja, tras funcionesCron().
       var variosNombramientos = [];
       novedad.forEach(element => {
          //console.log('element', element);
          if (element.length > 3) {
              var nombramiento = {
                  organismoId: new ObjectId(organismo),
                  descripcion: element,
                  fecha: new Date(fechaBoja),
                  boja: numBoja
              }
           variosNombramientos.push(nombramiento);
          }
       });
      
       console.log('Nuevos nombramientos a grabar: ', variosNombramientos.length);
       if (variosNombramientos.length > 0){
           //return variosNombramientos;
         try {
          coleccionNombramientos.insertMany(variosNombramientos);
          return 'res.status(201).json({ success: true })';
          } catch (error) {
          console.log(error);
          return 'res.status(400).json({ success: false, error})';
          } 
      }
  }
      else {console.log('Nada que grabar. Fin.')};
      // Devuelve una respuesta.
  //res.send('Proceso de grabación terminado.' + numBoja);
      }, 5000);
  }
//////////////////
async function obtenerNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res)
{
    try {
        if (!ObjectId.isValid(req.params.organismoId)) throw 'El organismo indicado no es válido';

        const organismo = await coleccionOrganismos.findOne(new ObjectId(req.params.organismoId)); // añado new, según encontré en Stackoverflow
        if (!organismo) throw 'No se ha encontrado el organismo indicado';

        const nombramientos = await coleccionNombramientos.find({ organismoId: new ObjectId(req.params.organismoId)}).toArray();
        //console.log(nombramientos);
        return res.status(200).json({success: true, nombramientos});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error});
    } 
}
//////////////////
async function obtenerNombramientosXNombre(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res)
{
    try {
       // if (!ObjectId.isValid(req.params.organismoId)) throw 'El organismo indicado no es válido';
       const organismo = await coleccionOrganismos.findOne({ nombre: req.params.nombre }); // 
       console.log(req.params.nombre, organismo._id);
        if (!organismo) throw 'No se ha encontrado el organismo indicado';

    //    const nombramientos = await coleccionNombramientos.find(
    //      { organismoId: new ObjectId(organismo._id) },{boja: {$lt: 500}}, {'fechaPublicacion': {'$dateToString': {'format': '%d-%B-%Y','date': '$fecha'}}}).sort({boja: -1}).toArray();
    const nombramientos = await coleccionNombramientos.aggregate (
      [
          {
            '$match': {
              'organismoId': new ObjectId(organismo._id)
            }
          },
           {
            '$project': {
              'descripcion': '$descripcion', 
              'fechaPublicacion': {
                '$dateToString': {
                  'format': '%d-%B-%Y', 
                  'date': '$fecha'
                }
              }, 
              'boja': '$boja'
            }
          }, {
            '$sort': {
              'boja': -1
            }
          }
        ]
        ).toArray();

        console.log(nombramientos);
        //return res.status(200).json({success: true, nombramientos});
        return res.render("listado",{ prod: nombramientos});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error});
    } 
}
//////////////////
async function ultimosNombramientos(coleccionOrganismos, coleccionNombramientos, ObjectId, req, res)
{
    try {
        const organismo = await coleccionOrganismos.findOne({ nombre: req.params.nombre }); // 
        const nombramientos = await coleccionNombramientos.aggregate (
            [
                {
                  '$match': {
                    'organismoId': new ObjectId(organismo._id)
                  }
                }, {
                  '$match': {
                    'descripcion': {
                      '$ne': 'Sin novedad.'
                    }
                  }
                }, {
                  '$project': {
                    'descripcion': '$descripcion', 
                    'fechaPublicacion': {
                      '$dateToString': {
                        'format': '%d-%B-%Y', 
                        'date': '$fecha'
                      }
                    }, 
                    'boja': '$boja'
                  }
                }, {
                  '$sort': {
                    'boja': -1
                  }
                },
                {'$limit': 20
                }
              ]
            ).toArray();
        console.log(nombramientos);
        return res.render("ultimos",{ prod: nombramientos});
        //return res.status(200).json({success: true, nombramientos});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error});
    }  
}
//////////////////
async function consultaUltimoBoja(coleccionNombramientos, ObjectId, res){
  try {
    const numeroPublicados = await coleccionNombramientos.aggregate (
      [
        {
          '$match': {
              'organismoId': new ObjectId(organismo) 
          }
        },
          {
            $sort:
              {
                fecha: -1,
              },
          },
          {
            $limit: 1,
          },
          {
            $project:
              {
                _id: 0,
                boja: 1,
                fechaTxt: {
                  $dateToString: {
                    format: "%d-%m-%Y",
                    date: "$fecha",
                  },
                },
              },
          },
        ]).toArray();
    console.log('2 - num. Pub:', numeroPublicados[0].boja);
    // Representa los resultados
    return numeroPublicados[0]; // es el primer elemento del array
  } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error});
  };
}

//////////////////
async function consultaUltimoBoja2(coleccionNombramientos, req, res){  // BORRRAAAAARRRRR
  try {
    const numeroPublicados = await coleccionNombramientos.aggregate (
      [
          {
            $sort:
              {
                fecha: -1,
              },
          },
          {
            $limit: 1,
          },
          {
            $project:
              {
                _id: 0,
                boja: 1,
                fechaTxt: {
                  $dateToString: {
                    format: "%d-%m-%Y",
                    date: "$fecha",
                  },
                },
              },
          },
        ]).toArray();
    console.log('2 - num. Pub:', numeroPublicados[0].boja);
    // Representa los resultados
     const ss = numeroPublicados[0]; // es el primer elemento del array
     //res.render('mantenimiento', { datos: numeroPublicados }); // es el primer elemento del array
     //req.flash('test', 'numeroPublicados[0].boja');
        //res.ss = "boja";
   return ss;
    } 
    catch (error) {
          console.log('error', error);
      //    return res.status(400).json({ success: false, error});
    }  ;
    
}
//////////////////
async function estadoBD(coleccionNombramientos, ObjectId, req, res){
    try {
      const numeroPublicados = await consultaUltimoBoja(coleccionNombramientos, ObjectId, res);
      console.log('numeroPublicados:', numeroPublicados);
      // Representa los resultados
      res.render('mantenimiento', { datos: numeroPublicados }); // es el primer elemento del array
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, error});
    }  ;
    
}

//////////////////

 async function middleFunction( req, res, next) {
  //setTimeout(async () => {
    console.log("Prueba Middleware");
   // req.flash('test', 'foo');
   const ss = "yeahhhhh";
   //const ss = await consultaUltimoBoja2(coleccionNombramientos, res); // esto da error
   req.ss = ss;
   req.flash('test', ss);
  // req.flash('test', '99');
   //console.log = req.ss;
   return next(); //esto no va
//}, 1000);

}
//////////////////
module.exports = {
    obtenerOrganismos : obtenerOrganismos,
    insertarNombramiento : insertarNombramiento,
    insertarVariosNombramientos : insertarVariosNombramientos,
    obtenerNombramientos : obtenerNombramientos,
    obtenerNombramientosXNombre : obtenerNombramientosXNombre,
    insertarVariosNombramientos2 : insertarVariosNombramientos2,
    ultimosNombramientos : ultimosNombramientos,
    estadoBD : estadoBD,
    consultaUltimoBoja : consultaUltimoBoja,
    middleFunction : middleFunction
}