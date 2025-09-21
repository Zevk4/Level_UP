/**
 * ------------------------------------------------------------------------
 * Módulo del Carrito de Compras (cart.js)
 * ------------------------------------------------------------------------
 * Responsabilidades:
 * - Gestionar el estado del carrito en localStorage.
 * - Renderizar el drawer (panel lateral) del carrito.
 * - Manejar las interacciones del usuario (añadir, quitar, actualizar).
 * - Proteger el checkout para que solo usuarios logueados puedan pagar.
 * ------------------------------------------------------------------------
 */

// Importamos las dependencias necesarias de otros módulos
import { $, CLP } from './utils.js';
import { usuario, esDuoc, isUserLoggedIn } from './auth.js';
import { PATH, asset } from './config.js';

// --- ESTADO Y SELECTORES ---

// El estado del carrito vive aquí, se lee de localStorage al iniciar.
const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

// Selectores de los elementos del DOM que usaremos.
const drawer = $('#cartDrawer');
const btnCart = $('.carrito-compra');
const cartItems = $('#cartItems');
const subtotalEl = $('#subtotal');
const duocEl = $('#duoc');
const totalEl = $('#total');
const closeCartBtn = $('#closeCart');
const checkoutBtn = $('#checkout');

// --- FUNCIONES INTERNAS ---

/**
 * Actualiza el DOM para mostrar el contenido actual del carrito.
 * Calcula subtotal, descuento y total.
 */
function renderCart() {
    if (!cartItems) return; // Si no estamos en una página con carrito, no hacemos nada.
    
    cartItems.innerHTML = '';
    let subtotal = 0;

    carrito.forEach(it => {
        subtotal += it.precio * it.qty;

        const row = document.createElement('div');
        row.className = 'cart-line';
        row.innerHTML = `
            <img src="${asset(it.imagen)}" alt="${it.nombre}" class="w-16 h-12 object-cover rounded-md flex-shrink-0" loading="lazy">
            <div class="info">
                <strong title="${it.nombre}">${it.nombre}</strong>
                <div class="muted">${CLP(it.precio)} — Cant. ${it.qty}</div>
            </div>
            <div class="acciones">
                <button type="button" class="menos text-white px-2" data-code="${it.codigo}">−</button>
                <button type="button" class="mas text-white px-2" data-code="${it.codigo}">＋</button>
                <button type="button" class="del text-white px-2" data-code="${it.codigo}">🗑️</button>
            </div>`;
        cartItems.appendChild(row);
    });

    const descuento = usuario && esDuoc(usuario?.email) ? Math.round(subtotal * 0.20) : 0;
    
    if(subtotalEl) subtotalEl.textContent = CLP(subtotal);
    if(duocEl) duocEl.textContent = descuento ? `- ${CLP(descuento)}` : CLP(0);
    if(totalEl) totalEl.textContent = CLP(Math.max(0, subtotal - descuento));

    // Guardamos el estado actual del carrito en localStorage.
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Abre el panel lateral del carrito.
 */
function abrirCarrito() {
    if (drawer) {
        drawer.hidden = false;
        drawer.setAttribute('open', '');
        renderCart(); // Siempre renderizamos al abrir para tener los datos frescos.
    }
}

/**
 * Cierra el panel lateral del carrito.
 */
function cerrarCarrito() {
    if (drawer) {
        drawer.hidden = true;
        drawer.removeAttribute('open');
    }
}

// --- FUNCIONES EXPORTADAS ---

/**
 * Añade un producto al carrito o incrementa su cantidad.
 * @param {object} producto - El objeto del producto a añadir.
 * @param {number} qty - La cantidad a añadir.
 */
export function agregarAlCarrito(producto, qty = 1) {
    const line = carrito.find(x => x.codigo === producto.codigo);

    if (line) {
        line.qty += qty;
    } else {
        carrito.push({
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            qty
        });
    }

    abrirCarrito(); // Abrimos el carrito para que el usuario vea que se añadió.
}

/**
 * Función principal que inicializa todos los listeners del carrito.
 * Se llama una sola vez desde main.js
 */
export function initCart() {
    if (btnCart) btnCart.addEventListener('click', abrirCarrito);
    if (closeCartBtn) closeCartBtn.addEventListener('click', cerrarCarrito);

    if (cartItems) {
        cartItems.addEventListener('click', (e) => {
            const menos = e.target.closest('.menos');
            const mas = e.target.closest('.mas');
            const del = e.target.closest('.del');
            if (!menos && !mas && !del) return;

            const code = (menos || mas || del).getAttribute('data-code');
            const idx = carrito.findIndex(x => x.codigo === code);
            if (idx < 0) return;

            if (menos) carrito[idx].qty = Math.max(1, carrito[idx].qty - 1);
            if (mas) carrito[idx].qty += 1;
            if (del) carrito.splice(idx, 1);
            
            renderCart();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (!isUserLoggedIn()) {
                alert('Debes iniciar sesión para finalizar la compra.');
                window.location.href = PATH.AUTH; // Usa la ruta definida
                return;
            }

            if (carrito.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const subtotal = carrito.reduce((a, b) => a + b.precio * b.qty, 0);
            const descuento = usuario && esDuoc(usuario?.email) ? Math.round(subtotal * 0.20) : 0;
            const totalFinal = subtotal - descuento;
            
            alert(`¡Gracias por tu compra, ${usuario.nombre}!\nTotal pagado: ${CLP(totalFinal)}`);
            
            carrito.length = 0; // Vaciamos el array
            localStorage.removeItem('carrito');
            renderCart();
            cerrarCarrito();
        });
    }

    renderCart(); // Renderizamos una vez al cargar la página para mostrar el estado inicial.
}