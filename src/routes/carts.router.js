const { Router } = require('express');
const Cart = require('../models/Cart'); // Importa el modelo
const Product = require('../models/Product'); // Importa el modelo
const cartsRouter = Router();

// GET /api/carts/:cid (con populate)
cartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    // Usa .populate() para obtener la información completa del producto
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/carts (crea un nuevo carrito)
cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({});
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/carts/:cid/product/:pid (agrega un producto al carrito)
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find(item => item.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid/products/:pid
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid
cartsRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'La cantidad debe ser un número positivo' });
  }
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cid, 'products.product': pid },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/carts/:cid
cartsRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.status(200).json({ message: 'Todos los productos del carrito han sido eliminados' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = cartsRouter;