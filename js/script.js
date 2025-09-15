// Base de datos en memoria xD faltan productos si
const productos = [
    { codigo: 'JM001', imagen: '/assets/img/product/JM001.webp' , categoria: 'Juegos de Mesa', nombre: 'Catan', precio: 29990, descripcion: 'Juego clásico de estrategia y comercio.' },
    { codigo: 'JM002', imagen: '/assets/img/product/JM002.webp' ,categoria: 'Juegos de Mesa', nombre: 'Carcassome', precio: 24990, descripcion: 'Juego de fichas para crear paisajes y competir.' },
    // ACCESORIOS
    { codigo: 'AC001', imagen: '/assets/img/product/AC001.webp' , categoria: 'Accesorios', nombre: 'Controlador Inalámbrico Xbox Series X', precio: 59990, descripcion: 'Control inalámbrico para Xbox Series X y PC.' },
    { codigo: 'AC002', imagen: '/assets/img/product/AC002.webp' , categoria: 'Accesorios', nombre: 'Auriculares Gamer HyperX Cloud II', precio: 79990, descripcion: 'Sonido envolvente con micrófono desmontable y máxima comodidad.' },
    // CONSOLAS
    { codigo: 'CO001', imagen: '/assets/img/product/CO001.webp' ,categoria: 'Consolas', nombre: 'PlayStation 5', precio: 549990, descripcion: 'Consola de nueva generación con gráficos y carga ultrarrápida.' },
    // COMPUTADORES GAMERS
    { codigo: 'CG001', imagen: '/assets/img/product/CG001.webp' ,categoria: 'Computadores Gamers', nombre: 'PC Gamer ASUS ROG Strix', precio: 1299990, descripcion: 'PC de alto rendimiento diseñado para gamers exigentes.' },
    // SILLAS GAMERS
    { codigo: 'SG001', imagen: '/assets/img/product/SG001.webp' ,categoria: 'Sillas Gamers', nombre: 'Silla Gamer Secretlab Titan', precio: 349990, descripcion: 'Silla ergonómica con soporte ajustable para largas sesiones.' },
    // MOUSES
    { codigo: 'MO001', imagen: '/assets/img/product/MO001.webp' ,categoria: 'Mouses', nombre: 'Mouse Gamer Logitech G502 HERO', precio: 49990, descripcion: 'Mouse preciso con sensor avanzado y botones personalizables.' },
    // MOUSEPADS
    { codigo: 'MP001', imagen: '/assets/img/product/MP001.webp' ,categoria: 'Mousepads', nombre: 'Mousepad Gamer Razer Goliathus Extended Chroma', precio: 29990, descripcion: 'Superficie amplia con iluminación RGB personalizable.' },
    // POLERAS PERSONALIZADAS
    { codigo: 'PP001', imagen: '/assets/img/product/PP001.webp' ,categoria: 'Poleras Personalizadas', nombre: 'Polera Gamer Personalizada "Level Up"', precio: 14990, descripcion: 'Camiseta cómoda personalizable con tu gamer tag o diseño.' },
];

// Función para renderizar los productos en la página
function renderizarProductos() {
    const catalogoContainer = document.querySelector('.catalogo');
    
    productos.forEach(producto => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h4>${producto.nombre}</h4>
            <p>${producto.descripcion}</p>
            <p class="precio">$${producto.precio.toLocaleString('es-CL')} CLP</p>
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