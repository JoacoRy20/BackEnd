const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const ProductManager = require('./managers/ProductManager');

const app = express();
const PORT = 8080;
const productManager = new ProductManager('products.json');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); // Ruta para las vistas

// Inicializar el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});

// Inicializar el servidor de Websockets
const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log('Cliente conectado a través de socket.io');

  // Envía todos los productos al cliente recién conectado
  const products = await productManager.getProducts();
  socket.emit('updateProducts', products); // <-- Corregido aquí

  // Escucha eventos de "addProduct" desde el cliente
  socket.on('addProduct', async (newProduct) => {
    try {
      await productManager.addProduct(newProduct);
      const updatedProducts = await productManager.getProducts();
      io.emit('updateProducts', updatedProducts); // <-- Corregido aquí
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  });

  // Escucha eventos de "deleteProduct" desde el cliente
  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      const updatedProducts = await productManager.getProducts();
      io.emit('updateProducts', updatedProducts); // <-- Y aquí
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  });
});
