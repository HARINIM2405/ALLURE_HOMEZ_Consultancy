// models/Portfolio.js
import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  name: String,
  description: String,
}, { _id: false });

const dealerSchema = new mongoose.Schema({
  name: String,
  subtitle: String,
  initial: String,
}, { _id: false });

const featuredProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, // image file path or external URL
}, { _id: false });

const productItemSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  imageUrl: String, // path to uploaded image (e.g. '/uploads/products/curtain1.jpg')
}, { _id: false });

const showcaseSchema = new mongoose.Schema({
  Curtains: [productItemSchema],
  Cushions: [productItemSchema],
  Bedding: [productItemSchema],
  Kitchen: [productItemSchema],
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  introTitle: String,
  introText: String,

  materialTitle: String,
  materialDescription: String,
  materials: [materialSchema],

  dealersTitle: String,
  dealersText: String,
  dealers: [dealerSchema],

  featuredProjects: [featuredProjectSchema], // ✅ Corrected to array of projects

  productShowcase: showcaseSchema,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
