// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  details: String,
  price: Number,
  image: String, // URL or filename
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
