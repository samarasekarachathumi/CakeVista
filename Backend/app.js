

//connect express and mongodb

const express = require("express");
const mongoose = require("mongoose");
const app = express();

//modleware
app.use("/",(req , res, next) => {
   res.send("It is working");
})

mongoose.connect ("mongodb+srv://cakeadmin:GvAoFA1XhuDbWxeY@cluster0.wziez.mongodb.net/")
.then(()=> console.log("connect to mongodb"))
.then(()=>{
    app.listen(5000);
})

.catch((err)=> console.log((err)));