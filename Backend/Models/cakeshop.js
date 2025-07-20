import mongoose from "mongoose";

  //cake shop
  const cakeshopSchema = mongoose.Schema({
    name: String,
    age: Number,
    location: String,
    email: String
  });

  const Cake = mongoose.model("cake", cakeshopSchema);

  export default Cake;