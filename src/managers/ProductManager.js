const fs = require('fs/promises');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Carga los productos desde el archivo
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devuelve un array vacío
      return [];
    }
  }

  // Guarda los productos en el archivo
  async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  // Genera un ID único para un nuevo producto
  async getNextId() {
    const products = await this.getProducts();
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  // Agrega un nuevo producto
  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: await this.getNextId(),
      ...productData,
      status: true, // El estatus se establece por defecto en true
      thumbnails: productData.thumbnails || [], // Maneja el caso de que no se envíen miniaturas
    };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
  }

  // Obtiene un producto por su ID
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  // Actualiza un producto por su ID
  async updateProduct(id, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return null; // Producto no encontrado
    }

    const updatedProduct = {
      ...products[productIndex],
      ...updatedFields,
      id: products[productIndex].id, // Evita que se actualice el ID
    };

    products[productIndex] = updatedProduct;
    await this.saveProducts(products);
    return updatedProduct;
  }

  // Elimina un producto por su ID
  async deleteProduct(id) {
    let products = await this.getProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
      return false; // Producto no encontrado
    }

    await this.saveProducts(products);
    return true;
  }
}

module.exports = ProductManager;