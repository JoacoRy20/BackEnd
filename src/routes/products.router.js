const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const productsRouter = Router();
const productManager = new ProductManager('products.json');

// Listar todos los productos o una cantidad limitada por query
productsRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts();
  if (limit) {
    return res.json(products.slice(0, limit));
  }
  res.json(products);
});

// Traer un producto por su ID
productsRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(parseInt(pid));
  if (product) {
    return res.json(product);
  }
  res.status(404).json({ message: 'Producto no encontrado.' });
});

// Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Actualizar un producto por su ID
productsRouter.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = await productManager.updateProduct(parseInt(pid), req.body);
  if (updatedProduct) {
    return res.json(updatedProduct);
  }
  res.status(404).json({ message: 'Producto no encontrado.' });
});

// Eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const success = await productManager.deleteProduct(parseInt(pid));
  if (success) {
    return res.json({ message: 'Producto eliminado.' });
  }
  res.status(404).json({ message: 'Producto no encontrado.' });
});

module.exports = productsRouter;