const socket = io();

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');
const productTemplate = document.getElementById('product-template');

// Manejo del formulario
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const product = Object.fromEntries(formData);
        
        // Emitir evento de nuevo producto
        socket.emit('addProduct', product);
        productForm.reset();
    });
}

// Escuchar actualizaciones de productos
socket.on('updateProducts', (products) => {
    if (productList) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = createProductElement(product);
            productList.appendChild(productElement);
        });
    }
});

// Función para crear elemento de producto
function createProductElement(product) {
    const template = productTemplate.content.cloneNode(true);
    
    template.querySelector('.card-title').textContent = product.title;
    template.querySelector('.description').textContent = product.description;
    template.querySelector('.price').textContent = product.price;
    template.querySelector('.category').textContent = product.category;
    template.querySelector('.stock').textContent = product.stock;
    template.querySelector('.id').textContent = `ID: ${product.id}`;
    
    const deleteBtn = template.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        socket.emit('deleteProduct', product.id);
    });
    
    return template;
}

// Manejar errores
socket.on('error', (error) => {
    alert('Error: ' + error.message);
}); 