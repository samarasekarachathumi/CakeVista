import express from 'express';
import mongoose from 'mongoose';
import cakeshopRouter from './Routes/cakeshopRouter.js';
import productRouter from './Routes/productRoutes.js';
import userRouter from './Routes/userRoute.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json()); // Replaces body-parser
app.use((req, res, next) => {
  const tokenString = req.header("Authorization")
  if(tokenString !=null){
    const token = tokenString.replace("Bearer","")
      

      jwt.verify(token, "cbcbatch2023", (err, decoded) => {
        if(decoded != null){
         req.user = decoded
          next()
  }else{
      console.log(err)  
      res.status(403).json({ message: "Unauthorized" });
  }
    })
  }
  else{
    next()
  }
})

mongoose
  .connect("mongodb+srv://admin:123@cluster0.54xqxya.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("connected to the DB");
  })
  .catch(() => {
    console.log("DB connection is failed");
  });

app.use("/cakeshop", cakeshopRouter);
app.use("/product", productRouter);
app.use("/user", userRouter);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


