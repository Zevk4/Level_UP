import { login } from './auth.js';
import { initAuthUI } from './auth.js';

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        loginMessage.textContent = 'Completa todos los campos.';
        return;
    }

    const success = login(email, password);
    if (!success) {
        loginMessage.textContent = 'Correo o contraseña incorrecta.';
    }
});

// Inicializar UI al cargar
document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
});
