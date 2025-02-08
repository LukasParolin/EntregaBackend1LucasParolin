// Importar la clase ProductManager
const ProductManager = require('./ProductManager.js');

// Crear una instancia de ProductManager
const manager = new ProductManager();

// Agregar algunos productos
try {
    manager.addProduct(
        "Producto prueba",
        "Este es un producto prueba",
        200,
        "Sin imagen",
        "abc123",
        25
    );

    manager.addProduct(
        "Producto prueba 2",
        "Este es otro producto prueba",
        300,
        "Sin imagen",
        "xyz789",
        30
    );

    // Mostrar todos los productos
    console.log("Todos los productos:", manager.getProducts());

    // Buscar un producto por ID
    console.log("Producto con ID 1:", manager.getProductById(1));

    // Intentar buscar un producto que no existe
    console.log("Buscando producto inexistente:", manager.getProductById(999));

    // Intentar agregar un producto con código duplicado
    manager.addProduct(
        "Producto con código duplicado",
        "Este producto no se debe agregar",
        150,
        "Sin imagen",
        "abc123", // Código duplicado
        20
    );
} catch (error) {
    console.error("Error:", error.message);
} 