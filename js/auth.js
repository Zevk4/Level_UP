// auth.js
import { preUsers } from './preUsers.js';

// Variables globales
export let usuario = null;

export function isUserLoggedIn() {
    const sesion = localStorage.getItem('userSession');
    if (sesion) {
        usuario = JSON.parse(sesion);
        return true;
    }
    return false;
}

export function login(email, password) {
    const user = preUsers.find(u => u.email === email && u.password === password);
    if (user) {
        usuario = { nombre: user.nombre, email: user.email };
        localStorage.setItem('userSession', JSON.stringify(usuario));

        // Redirigir al admin si es admin
        if (email === 'admin@adminlvup.cl') {
            window.location.href = './admin/index_admin.html';
        } else {
            window.location.href = './index.html';
        }

        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem('userSession');
    usuario = null;
    window.location.href = './index.html';
}

// UI de sesión
export function initAuthUI() {
    const loginContainer = document.getElementById('login-container');
    const userProfileContainer = document.getElementById('user-profile-container');
    const userGreeting = document.getElementById('user-greeting');

    if (isUserLoggedIn()) {
        if (loginContainer) loginContainer.classList.add('hidden');
        if (userProfileContainer) userProfileContainer.classList.remove('hidden');
        if (userGreeting) userGreeting.textContent = `Hola, ${usuario.nombre}`;
    } else {
        if (loginContainer) loginContainer.classList.remove('hidden');
        if (userProfileContainer) userProfileContainer.classList.add('hidden');
    }
}
