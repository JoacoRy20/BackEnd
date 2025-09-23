## 🚀 Cómo iniciar el servidor

1.  Asegúrate de tener **Node.js** y **MongoDB Atlas** configurado.
2.  Abre la terminal en la carpeta principal de tu proyecto.
3.  Instala todas las dependencias con el siguiente comando:
    ```bash
    npm install
    ```
4.  Para iniciar el servidor, usa el comando:
    ```bash
    npm start
    ```
    *Nota: Si `npm start` te da un error, usa `node src/app.js`.*

## 📄 Endpoints de la API

Una vez que el servidor esté funcionando, puedes probar los siguientes endpoints para gestionar productos y carritos:

### Endpoints de Productos (`/api/products`)

  * **`GET /`**: Lista todos los productos con paginación, filtros y ordenamiento.
      * **Ejemplo con filtros**: `http://localhost:8080/api/products?limit=5&page=2&sort=asc&query=libros`
  * **`POST /`**: Agrega un nuevo producto.
  * **`GET /:pid`**: Obtiene un producto por su ID.
  * **`PUT /:pid`**: Actualiza un producto por su ID.
  * **`DELETE /:pid`**: Elimina un producto por su ID.

### Endpoints de Carritos (`/api/carts`)

  * **`POST /`**: Crea un nuevo carrito.
  * **`GET /:cid`**: Lista los productos de un carrito específico. Esta ruta usa `populate` para mostrar todos los detalles del producto, no solo su ID.
  * **`POST /:cid/product/:pid`**: Agrega un producto a un carrito.
  * **`PUT /:cid`**: Actualiza todos los productos de un carrito con un arreglo nuevo.
  * **`PUT /:cid/products/:pid`**: Actualiza solo la cantidad de un producto específico en el carrito.
  * **`DELETE /:cid/products/:pid`**: Elimina un producto de un carrito.
  * **`DELETE /:cid`**: Vacía por completo un carrito.

## ✨ Vistas con Handlebars y WebSockets

Las vistas ahora interactúan directamente con la base de datos de MongoDB.

  * **`http://localhost:8080/products`**: Visualiza todos los productos con **paginación**.
  * **`http://localhost:8080/realtimeproducts`**: Muestra la lista de productos que se actualiza en **tiempo real** al agregar o eliminar.
  * **`http://localhost:8080/carts/:cid`**: Muestra los productos de un carrito específico, ideal para probar la función `populate`.