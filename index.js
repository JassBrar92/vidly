const winston=require('winston');
//require('winston-mongodb');
const err=require('./middleware/error');
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const mongoose = require('mongoose'); 
const genres = require('./routes/genres'); 
const customers = require('./routes/customers');
const movies = require('./routes/movies'); 
const rentals=require('./routes/rentals');
const users=require('./routes/users');
const auth=require('./routes/auth');
const config=require('config');
const express = require('express');
const { error } = require('joi/lib/types/lazy');
const app = express();
process.on('uncaughtException',(ex)=>{
  console.log('Uncaught Exception');
  winston.error(ex.message,ex);
});
process.on('unhandledRejection',(ex)=>{
  winston.error(ex.message,ex);
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
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);
app.use(err);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
