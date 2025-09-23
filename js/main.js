/**
 * Orquestador Principal (main.js)
 */

// --- IMPORTACIONES DE MÓDULOS ---
import { productos } from './products.js';
import { initAuthUI } from './auth.js';
import { initCart } from './cart.js';
import { renderCatalogo, renderDetalleProducto, renderMasVisto, renderSearchResults } from './ui.js';
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

    // 3. Inicializa el mapa del footer
    if ($('#footerMap')) {
        const footerMap = L.map('footerMap').setView([-36.827, -73.0503], 13); // Concepción, Chile

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(footerMap);

        // --- Marcadores personalizados ---
        const predefinedMarkers = [
            { name: 'ExpoGames', lat: -36.827, lng: -73.0503 },
            { name: 'KuroFest', lat: -36.829, lng: -73.055 },
            { name: 'GamesCon', lat: -36.825, lng: -73.048 }
        ];

        predefinedMarkers.forEach(marker => {
            L.marker([marker.lat, marker.lng])
                .addTo(footerMap)
                .bindPopup(marker.name);
        });
        // --- Fin de marcadores personalizados ---
    }

    // Otros detalles
    const yearEl = $('#year'); 
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// --- LÓGICA DEL BUSCADOR ---
const searchBar = $('.search-bar');
const searchResults = $('.search-results');

if (searchBar && searchResults) {
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 2) {
            const resultados = productos.filter(p => p.nombre.toLowerCase().includes(query));
            renderSearchResults(resultados);
            searchResults.classList.remove('hidden');
        } else {
            searchResults.classList.add('hidden');
        }
    });
}