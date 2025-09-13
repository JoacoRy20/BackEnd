const socket = io();

// Escucha el evento 'updateProducts' desde el servidor
socket.on('updateProducts', (products) => {
  const productList = document.getElementById('productList');
  productList.innerHTML = ''; // Limpia la lista

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price} <button class="delete-btn" data-id="${product.id}">Eliminar</button>`;
    productList.appendChild(li);
  });
});

// Agrega un listener al formulario para enviar un nuevo producto
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    code: document.getElementById('code').value,
    price: parseFloat(document.getElementById('price').value),
    stock: parseInt(document.getElementById('stock').value),
    category: document.getElementById('category').value,
  };

  socket.emit('addProduct', product);
  addProductForm.reset();
});

// Agrega un listener para los botones de eliminar
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const id = parseInt(e.target.dataset.id);
    socket.emit('deleteProduct', id);
  }
});