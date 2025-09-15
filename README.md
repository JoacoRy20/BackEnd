# Entrega N° 2 - Servidor de Productos en Tiempo Real

¡Hola! Este es un servidor de Node.js y Express para gestionar productos y carritos de compra.

## 🚀 Cómo iniciar el servidor

1.  Asegúrate de tener Node.js instalado.
2.  Abre la terminal en la carpeta principal del proyecto.
3.  Instala las dependencias con el siguiente comando:
    ```bash
    npm install
    ```
4.  Inicia el servidor con el siguiente comando:
    ```bash
    npm start
    ```
    *Nota: Si el comando `npm start` no funciona, puedes usar `node src/app.js` para iniciar el servidor directamente.*

## 📄 Endpoints de la API

Una vez que el servidor esté corriendo, puedes probar los siguientes endpoints usando una herramienta como Postman o Thunder Client:

* **`GET /api/products`**: Lista todos los productos.
* **`POST /api/products`**: Agrega un nuevo producto.
* **`GET /api/products/:pid`**: Obtiene un producto por ID.
* **`PUT /api/products/:pid`**: Actualiza un producto.
* **`DELETE /api/products/:pid`**: Elimina un producto.
* **`POST /api/carts`**: Crea un nuevo carrito.
* **`GET /api/carts/:cid`**: Lista los productos de un carrito.
* **`POST /api/carts/:cid/product/:pid`**: Agrega un producto a un carrito.

## ✨ Vistas con Handlebars y WebSockets

Las vistas de este proyecto se renderizan con Handlebars y se actualizan en tiempo real usando WebSockets.

* **`http://localhost:8080/`**: Vista estática que muestra todos los productos agregados.
* **`http://localhost:8080/realtimeproducts`**: Vista que se actualiza en tiempo real. Aquí puedes agregar y eliminar productos, y la lista se refrescará automáticamente para todos los clientes conectados.
