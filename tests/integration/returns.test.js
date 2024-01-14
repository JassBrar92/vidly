const request=require("supertest");
const moment=require("moment");
const {User}=require("../../models/user"); 
const {Rental}=require("../../models/rental");
const {Movie}=require("../../models/movie");
const mongoose=require("mongoose");
describe('api/returns',()=>{
  let customerId;
  let movieId;
  let server;
  let rental;
  let token;
  const exec=()=>{
    return request(server)
    .post('api/returns')
    .set('x-auth-token',token)
    .send({customerId,movieId});
  };
  beforeEach(async()=>{
    server=require("../../index");
    customerId=mongoose.Types.ObjectId();
    movieId=mongoose.Types.ObjectId();
    token=new User().generateAuthToken();
    movie =new Movie({
      _id:movieId,
      title:'12345',
      dailyRentalRate:2,
      genre:{ name:'12345'},
      numberInStock:12,
    });
    await movie.save();
    rental=new Rental({
      customer:{
        _id:customerId,
        name:'12345',
        phone:'12345'
      },
      movie:{
        _id:movieId,
        title:"'12345",
        dailyRentalRate:2
      }
    });
    await rental.save();
  });
  afterEach(async()=>{ 
    await server.close();
    await Rental.remove({});
  });
  it("should return 401 if client is not logged in",async()=>{
    token="";
    const res=await exec();
    expect(res.status).toBe(401);
  });
  it("should return 400 if customer id  is not provided",async()=>{
    customerId="";
    const res=await exec();
    expect(res.status).toBe(400);
  });
  it("should return 400 if movie id is not provided",async()=>{
    movieId="";
    const res=await exec();
    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental found for the customer/movie",async()=>{
    await Rental.remove({});
    const res=await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if rental is already processed ", async()=>{
    rental.dateReturned=new Date();
    await rental.save();
    const res=await exec();
    expect(res.status).toBe(400);
  });
  it("it should return 200 if request is valid", async()=>{
    const res=await exec();
    expect(res.status).toBe(200);
  });
  it("set the return date",async()=>{
    const res=await exec();
    const rentalInDB=await Rental.findById(rental._id);
    const difference=new Date()-rentalInDB.dateReturned;
    expect(difference).toBeLessThan(10*1000);
  });
  it("it should return rental fee if input is valid",async()=>{
    rental.dateOut=moment().add(-7,'days').toDate();
    await rental.save();
    const res=await exec();
    const rentalInDB=await Rental.findById(rental._id);
    expect(rentalInDB.rentalFee).toBe(14);
  });
  it('it should increase movie in stock if input is valid',async()=>{
    const res=await exec();
    const movieInDB=await Movie.findById(movie._id);
    expect(movieInDB.numberInStock).toBe(movie.numberInStock+1);
  });
  it("it should return the rental if i nput is valid",async()=>{
    const res=await exec();
    const rentalInDB=await Rental.findById(rental._id); 
    expect(Object.key(res.body)).toEqual(expect.arrayContaining([
      'dateOut','dateReturned','rentalFee','customer','movie'
    ]));
  });
});