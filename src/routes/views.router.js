const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');

const viewsRouter = Router();
const productManager = new ProductManager('products.json');

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

module.exports = viewsRouter;