// Base de datos en memoria xD faltan productos si
const productos = [
    { codigo: 'JM001', categoria: 'Juegos de Mesa', nombre: 'Catan', precio: 29990, descripcion: 'Un clásico juego de estrategia...' },
];

// Función para renderizar los productos en la página
function renderizarProductos() {
    const catalogoContainer = document.querySelector('.catalogo');
    
    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <p class="precio">$${producto.precio.toLocaleString('es-CL')} CLP</p>
            <button class="add-to-cart-btn" data-codigo="${producto.codigo}">Agregar al Carrito</button>
        `;
        catalogoContainer.appendChild(productCard);
    });
}

// Llama a la función para que se ejecute cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    
    // Aquí puedes agregar la lógica para el carrito de compras
    const botonesAgregar = document.querySelectorAll('.add-to-cart-btn');
    const carrito = [];

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            const codigoProducto = boton.getAttribute('data-codigo');
            const productoSeleccionado = productos.find(p => p.codigo === codigoProducto);
            
            if (productoSeleccionado) {
                carrito.push(productoSeleccionado);
                console.log('Producto agregado al carrito:', productoSeleccionado.nombre);
                // Aquí podrías actualizar el número de productos en el carrito
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.querySelector('.menu-container');
    const megaMenu = document.querySelector('.mega-menu');

    // Muestra el menú cuando el mouse entra en el contenedor
    menuContainer.addEventListener('mouseenter', () => {
        megaMenu.style.display = 'flex';
    });

    // Oculta el menú cuando el mouse sale del contenedor
    menuContainer.addEventListener('mouseleave', () => {
        megaMenu.style.display = 'none';
    });
});