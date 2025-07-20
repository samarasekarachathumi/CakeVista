import Cake from "../Models/cakeshop.js";

export function getcakeshops(req,res){
    Cake.find().then(
        (data)=>{
            res.json(data)
        }
    )
}

export function savecakeshops(req, res){
  console.log(req.body);

  const cake = new Cake({
    name: req.body.name,
    age: req.body.age,
    location: req.body.location,
    email: req.body.email
  });

  cake
  .save()
  .then(()=>{
    res.json({
        message:"craeted cakeshop successfully",
    });
  })
  .catch(()=> {
    res.json( {
        message:"Failed cakeshop created",
    }); 
  })
    
};