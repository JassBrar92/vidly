const mongoose=require('mongoose');
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const Rental=mongoose.model('Rentals',new mongoose.Schema({
   customer:{
    type:new mongoose.Schema({
    name:{
    type:String,
    required:true,
    minlength:5,
    maxlength:255,
    },
    isGold:{
      type:Boolean,
      default:true
    },
    phone:{
      type:String,
      required:true,
      minlength:5,
      maxlength:15
    }
  }),
  required:true
},
   movie:{
    type:new mongoose.Schema({
    title:{
     type:String,
     required:true,
     trim:true,
     minlength:5,
     maxlength:255
    },
    dailyRentalRate:{
      type:String,
      required:true,
      min:0,
      max:255
    }
   }),
   required:true
  },
  dateOut:{
    type:Date,
    required:true,
    default:Date.now
  },
  dateReturned:{
    type:Date
  },
  retalFee:{
    type:Number,
    min:0
  }
}));

function validateRental(rental){
  const schema={
    customerId:Joi.objectId().required(),
    movieId:Joi.objectId().required()
  }
  return Joi.validate(rental,schema);
}
exports.Rental=Rental;
exports.validateRental=validateRental;