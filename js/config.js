/**
 * Archivo de Configuración Global (config.js)
 */

const IN_PAGES = /\/pages\//.test(location.pathname);
const IN_ADMIN = /\/admin\//.test(location.pathname);


// Exportamos las rutas para que cualquier módulo pueda usarlas
export const PATH = {
    ASSET_BASE: IN_ADMIN ? '..' : (IN_PAGES ? '..' : '.'),
    INDEX:      '../index.html', // Ruta fija a la raíz del proyecto
    PRODUCTO:   IN_PAGES ? 'producto.html' : 'pages/producto.html',
    CATEGORIA:  IN_PAGES ? 'categoria.html' : 'pages/categoria.html',
    AUTH:       IN_PAGES ? 'auth.html' : 'pages/auth.html'
};

// Exportamos la función de assets para que cualquier módulo pueda usarla
export const asset = (p) => `${PATH.ASSET_BASE}/${p}`;