/*
Fecha: 05-03-2024
Versión: 1.0
Autor: LG
Resumen: 
- Envía un mensaje a un grupo de Telegram con el contenido obtenido en la revisión del Boja.
*/

function enviaMensaje(mensaje) {
  const { Telegraf } = require('telegraf');
  require('dotenv').config();
  
  const chatToken = process.env['CHAT_TOKEN']
  const chatId = process.env['CHAT_ID'];
  const app = new Telegraf(chatToken); //
  if (mensaje.length > 2500) { mensaje = "Hay tantos nombramientos que no caben en un mensaje. Por favor, consulta directamente el BOJA."; }

  app.telegram.sendMessage(chatId, mensaje);
}

//enviaMensaje(['1', '2', '3']);
module.exports.enviaMensaje = enviaMensaje;
