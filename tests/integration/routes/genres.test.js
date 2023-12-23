let server;
const request=require("supertest");
const {Genre}=require("../../../models/genre");
describe("/api/genres",()=>{
  beforeEach(()=>{
    server=require("../../../index");
  });
  afterEach(async()=>{ 
    server.close();
    await Genre.remove({});
  });
  describe('Get',()=>{
    it("Should return all genres",async ()=>{
      await Genre.collection.insertMany([
        {name:'genre1'},     
        {name:'genre2'},
        ]);
    const res=await request(server).get("/api/genres");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);

    expect(res.body.some(g=>g.name==='genre1')).toBeTruthy();
    expect(res.body.some(g=>g.name==='genre2')).toBeTruthy();
    });
  });
  describe('Get /:id',()=>{
    it("shoud return a genre if id is valid",async()=>{
      const genre=new Genre({name:"genre1"});
      await genre.save();
     const res= await request(server).get('/api/genres/'+genre._id);
     expect(res.status).toBe(200);
     expect(res.body).toHaveProperty('name',genre.name);
    });
    it("should return 404 error if id is invalid",async()=>{
     const res= await request(server).get('/api/genres/1');
     expect(res.status).toBe(404);
    });
  });
  describe('Post',()=>{
    it("should return 401 error if client is not logged in",async()=>{
      const res=await request(server).post('/api/genres').send({name:'genre1'});
      expect(res.status).toBe(401);
    });
  });
});