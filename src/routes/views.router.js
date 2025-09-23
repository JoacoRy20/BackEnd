const { Router } = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const viewsRouter = Router();

// Vista de productos con paginación
viewsRouter.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
      lean: true // Agrega esto para que los datos sean objetos de JS simples
    };

    const filter = query ? { category: query } : {};
    const result = await Product.paginate(filter, options);
    
    res.render('products', {
      products: result.docs,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar los productos' });
  }
});

// Vista de un carrito específico con populate
viewsRouter.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) {
      return res.render('error', { message: 'Carrito no encontrado' });
    }
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar el carrito' });
  }
});

module.exports = viewsRouter;