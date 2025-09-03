

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


// Para las diferentes imagenes del Slider pero aun no esta listo XDDASDAD EN DESARROLLO O si me puedes ayudar a completarlo

/*

const images = [
    {
        src: "",
        alt: "Imagen del control de Xbox"
    },
    {
        src: "",
        alt: "Segunda imagen "
    },
    {
        src: "",
        alt: "Tercera imagen "
    }
];

    let currentIndex = 0;
    const sliderImage = document.getElementById("slider-image");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    function showImage(index) {
        sliderImage.src = images[index].src;
        sliderImage.alt = images[index].alt;
    }

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });


function initHeartPath(){
    heart = [];
    const PI2 = 6.28318;
    const steps = Math.max(32, config.particleCount);

    for (let i = 0; i < steps; 1++){
        const t = (i / steps) = PI2;
        heart.push([
            canvasW
        ])
    }
}


*/