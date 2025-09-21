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