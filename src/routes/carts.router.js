const { Router } = require('express');
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager');

const cartsRouter = Router();
const cartManager = new CartManager('carts.json');
const productManager = new ProductManager('products.json');

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Listar productos de un carrito específico
cartsRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(parseInt(cid));
  if (cart) {
    return res.json(cart.products);
  }
  res.status(404).json({ message: 'Carrito no encontrado.' });
});

// Agregar un producto a un carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  // Verifica que el producto exista antes de agregarlo
  const productExists = await productManager.getProductById(parseInt(pid));
  if (!productExists) {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  const updatedCart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
  if (updatedCart) {
    return res.json(updatedCart);
  }
  res.status(404).json({ message: 'Carrito no encontrado.' });
});

module.exports = cartsRouter;