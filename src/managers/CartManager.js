const fs = require('fs/promises');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Carga los carritos desde el archivo
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guarda los carritos en el archivo
  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  // Genera un ID único para un nuevo carrito
  async getNextId() {
    const carts = await this.getCarts();
    const lastCart = carts[carts.length - 1];
    return lastCart ? lastCart.id + 1 : 1;
  }

  // Crea un nuevo carrito
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: await this.getNextId(),
      products: [],
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  // Obtiene un carrito por su ID
  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  // Agrega un producto a un carrito
  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cid);

    if (cartIndex === -1) {
      return null; // Carrito no encontrado
    }

    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.product === pid);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, incrementa la cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto es nuevo, lo agrega al carrito
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this.saveCarts(carts);
    return cart;
  }
}

module.exports = CartManager;