/**
 * ------------------------------------------------------------------------
 * Módulo de Utilidades (utils.js)
 * ------------------------------------------------------------------------
 * Contiene funciones auxiliares y helpers que se comparten
 * en diferentes partes de la aplicación para evitar la duplicación de código.
 * ------------------------------------------------------------------------
 */

/**
 * Un alias corto para document.querySelector.
 * @param {string} selector - El selector CSS.
 * @returns {Element|null}
 */
export const $ = (selector) => document.querySelector(selector);

/**
 * Un alias para document.querySelectorAll que devuelve un Array.
 * @param {string} selector - El selector CSS.
 * @returns {Element[]}
 */
export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

/**
 * Formatea un número a moneda de Peso Chileno (CLP).
 * @param {number} number - El número a formatear.
 * @returns {string}
 */
export const CLP = (number) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    }).format(number);
};

// Simulación de una base de datos de usuarios en un JSON temporal SOLO DESARROLLO
export const usuariosRegistrados = [
    {
        nombre: "Admin",
        email: "admin@adminlvup.cl",
        password: "admin123", // Nota: Nunca almacenes contraseñas en texto plano en producción.
        rol: "admin"
    },
    {
        nombre: "Usuario",
        email: "usuario@correo.com",
        password: "usuario123",
        rol: "usuario"
    }
];

/**
 * Agrega un nuevo usuario al JSON temporal.
 * @param {string} nombre - El nombre del usuario.
 * @param {string} email - El correo del usuario.
 * @param {string} password - La contraseña del usuario.
 * @param {string} rol - El rol del usuario (por defecto "usuario").
 */
export const agregarUsuario = (nombre, email, password, rol = "usuario") => {
    usuariosRegistrados.push({ nombre, email, password, rol });
};