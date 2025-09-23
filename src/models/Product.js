// src/models/Product.js

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Lo necesitaremos para la paginación

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], default: [] }
});

productSchema.plugin(mongoosePaginate); // Habilitamos el plugin de paginación

const Product = mongoose.model('Product', productSchema);
module.exports = Product;