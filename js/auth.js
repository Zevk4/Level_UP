/**
 * ------------------------------------------------------------------------
 * Módulo de Autenticación (auth.js)
 * ------------------------------------------------------------------------
 * Responsabilidades:
 * - Gestionar el estado del usuario (leer de sessionStorage).
 * - Proveer funciones para verificar el estado de la sesión.
 * - Actualizar la UI del header para reflejar si el usuario está logueado o no.
 * - Manejar el cierre de sesión.
 * ------------------------------------------------------------------------
 */

// Importamos las dependencias necesarias
import { PATH } from './config.js';
import { $ } from './utils.js';

// --- ESTADO Y FUNCIONES AUXILIARES (EXPORTADAS) ---

// 1. Exportamos la variable 'usuario' para que otros módulos (como cart.js)
//    puedan acceder a la información del usuario logueado.
export const usuario = JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');

// 2. Exportamos una función para verificar si el usuario ha iniciado sesión.
export function isUserLoggedIn() {
    return usuario !== null;
}

// 3. Exportamos la función de verificación de email de Duoc.
export const esDuoc = (email) => /@duocuc\.cl$/i.test(email || '');

// 4. Exportamos la función de cierre de sesión.
export function logout() {
    
    sessionStorage.removeItem('loggedInUser');
    alert('Has cerrado la sesión.');
    window.location.href = PATH.INDEX; // Redirige al inicio
}

// --- LÓGICA DE LA INTERFAZ (UI) ---

/**
 * Función principal que inicializa la UI de autenticación.
 * Se encarga de mostrar "Iniciar Sesión" o el perfil del usuario.
 */
// js/auth.js

export function initAuthUI() {
    const loginContainer = document.getElementById('login-container');
    const userProfileContainer = document.getElementById('user-profile-container');
    
    if (!loginContainer || !userProfileContainer) {
        return;
    }

    if (isUserLoggedIn()) {
        // Lógica para cuando el usuario SÍ ha iniciado sesión
        const userGreeting = document.getElementById('user-greeting');
        loginContainer.classList.add('hidden');
        userProfileContainer.classList.remove('hidden');
        if (userGreeting) {
            userGreeting.textContent = `Hola, ${usuario.nombre}`;
        }
    } else {
        // Lógica para cuando el usuario NO ha iniciado sesión
        loginContainer.classList.remove('hidden');
        userProfileContainer.classList.add('hidden');

        // --- CAMBIO: AÑADIMOS EL LISTENER AQUÍ ---
        // Buscamos el botón dentro del contenedor de login
        const loginButton = loginContainer.querySelector('.button-sesion');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                // Al hacer clic, redirigimos a la página de autenticación
                window.location.href = PATH.AUTH;
            });
        }
    }
    
    const logoutButton = userProfileContainer.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
} 
// --- LÓGICA DE REGISTRO DE USUARIOS (SIMULADA) ---
// Nota: Esta es una simulación simple. En producción, esto se manejaría en el backend.
// TEMPORAL // SOLO DESARROLLO //
import { agregarUsuario, usuariosRegistrados } from './utils.js';

// Manejar el evento de registro
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('register-nombre').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Validar si el usuario ya existe
    const usuarioExistente = usuariosRegistrados.some((usuario) => usuario.email === email);

    if (usuarioExistente) {
        document.getElementById('register-message').textContent = "El usuario ya está registrado.";
    } else {
        // Agregar el nuevo usuario al JSON temporal
        agregarUsuario(nombre, email, password);
        document.getElementById('register-message').textContent = "Usuario registrado con éxito.";
        console.log("Usuarios registrados:", usuariosRegistrados);
    }
});