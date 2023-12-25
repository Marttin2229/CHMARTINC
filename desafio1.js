const EventEmitter = require('events');

class ProductManager extends EventEmitter {
  constructor() {
    super();
    this.products = [];
  }

  generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  getProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const existingProduct = this.products.find(product => product.code === code);

    if (existingProduct) {
      const error = new Error('El código del producto ya existe.');
      this.emit('error', error);
      return;
    }

    const id = this.generateUniqueId();
    const newProduct = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.emit('productAdded', { eid: id, product: newProduct });

    return newProduct;
  }

  getProductById(productId) {
    const product = this.products.find(product => product.id === productId);

    if (!product) {
      const error = new Error('Producto no encontrado.');
      this.emit('error', error);
      return;
    }

    return product;
  }
}

const productManager = new ProductManager();

productManager.on('productAdded', eventData => {
  console.log(`Producto agregado con ID ${eventData.eid}:`, eventData.product);
});

productManager.on('error', error => {
  console.error('Error:', error.message);
});

console.log(productManager.getProducts());

const newProduct = productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
});

console.log(productManager.getProducts());

productManager.addProduct({
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
});

const productId = productManager.getProducts()[0].id;
productManager.getProductById(productId);
