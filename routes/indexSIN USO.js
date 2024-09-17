var express = require('express');
const funcionesBD = require('../app/js/funcionesBD');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return funcionesBD.mainPrincipal(coleccionNombramientos, ObjectId, req, res);
});


module.exports = router;
