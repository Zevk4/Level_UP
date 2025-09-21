/**
 * Orquestador Principal (main.js)
 */

// --- IMPORTACIONES DE MÓDULOS ---
import { productos } from './products.js';
import { initAuthUI } from './auth.js';
import { initCart } from './cart.js';
import { renderCatalogo, renderDetalleProducto, renderMasVisto } from './ui.js';
import { $ } from './utils.js';

// --- INICIALIZACIÓN DE LA APLICACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa componentes globales
    initAuthUI();
    initCart();
    
    // 2. Renderiza contenido específico de la página
    if ($('.catalogo')) {
        renderCatalogo(productos);
    }
    if ($('#productDetailView')) {
        renderDetalleProducto(productos);
    }
    if ($('#mvTrack')) {
        renderMasVisto(productos);
    }

    // Otros detalles
    const yearEl = $('#year'); 
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});