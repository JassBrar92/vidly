const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi); 
const config=require('config');
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();
if(!config.get('jwtPrivateKey')){
  console.error('Fatal Error: jwtPrivateKey is not defined.');
  process.exit(1);
}
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
