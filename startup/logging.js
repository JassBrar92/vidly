const winston=require('winston');
//require('winston-mongodb');
module.exports=function(){
  /*process.on('uncaughtException',(ex)=>{
    console.log('Uncaught Exception');
    winston.error(ex.message,ex);
  });*/
  winston.handleExceptions(new winston.transports.Console({colorize:true,prettyPrint:true}),new winston.transports.File({filename:'logfile.log'}));
  process.on('unhandledRejection',(ex)=>{
    //winston.error(ex.message,ex);
    throw ex;
  });
  winston.add(winston.transports.File,{filename:'logfile.log'});
  //winston.add(winston.transports.MongoDB,{db:'mongodb://localhost:vidly'});
  //throw new Error("Something failed while startup");
  //const p=Promise.reject(new Error("Unhandle promise rejection"));
  //p.then(()=>console.log('done')); 
}