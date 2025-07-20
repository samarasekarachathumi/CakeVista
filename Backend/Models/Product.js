import mongoose from "mongoose";

const productSchema = mongoose.Schema({

  name : String, 
  description: String,
  price:  Number, 
  imageUrl: String, 
});

const Product = mongoose.model('Product', productSchema);

export default Product;
