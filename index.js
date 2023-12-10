const winston=require('winston');
//require('winston-mongodb');
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const mongoose = require('mongoose'); 
const config=require('config');
const express = require('express');
const { error } = require('joi/lib/types/lazy');
const app = express();
require('./startup/routes')(app);
process.on('uncaughtException',(ex)=>{
  console.log('Uncaught Exception');
  winston.error(ex.message,ex);
});
process.on('unhandledRejection',(ex)=>{
  winston.error(ex.message,ex);
  throw ex;
});
//winston.handleExceptions(new winston.transports.File({filename:'logfile.log'}));
winston.add(winston.transports.File,{filename:'logfile.log'});
//winston.add(winston.transports.MongoDB,{db:'mongodb://localhost:vidly'});
//throw new Error("Something failed while startup");
//const p=Promise.reject(new Error("Unhandle promise rejection"));
//p.then(()=>console.log('done'));
if(!config.get('jwtPrivateKey')){
  console.error('Fatal Error: jwtPrivateKey is not defined.');
  process.exit(1);
}
 mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
