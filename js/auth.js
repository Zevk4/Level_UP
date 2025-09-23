import { PATH } from './config.js';
import { $ } from './utils.js';
import { preUsers } from './preUsers.js';

// --- ESTADO Y FUNCIONES AUXILIARES ---

export let usuario = null;

export function isUserLoggedIn() {
    const sesion = sessionStorage.getItem('loggedInUser');
    if (sesion) {
        usuario = JSON.parse(sesion);
        return true;
    }
    return false;
}

export function logout() {
    sessionStorage.removeItem('loggedInUser');
    usuario = null;
    alert('Has cerrado la sesión.');
    window.location.href = PATH.INDEX;
}

export const esDuoc = (email) => /@duocuc\.cl$/i.test(email || '');
export function login(email, password) {
    const user = preUsers.find(u => u.email === email && u.password === password);
    if (user) {
        usuario = { nombre: user.nombre, email: user.email };
        sessionStorage.setItem('loggedInUser', JSON.stringify(usuario));

        if (email.toLowerCase().endsWith('@adminlvup.cl')) {
            // ¡Esta es la ruta y el nombre correctos!
            window.location.href = '../admin/index_admin.html';
        } else {
            // Esta ruta ya estaba bien
            window.location.href = '../index.html';
        }

        return true;
    }
    return false;
}

export function initAuthUI() {
    const loginContainer = document.getElementById('login-container');
    const userProfileContainer = document.getElementById('user-profile-container');
    if (!loginContainer || !userProfileContainer) return;

    if (isUserLoggedIn()) {
        const userGreeting = document.getElementById('user-greeting');
        loginContainer.classList.add('hidden');
        userProfileContainer.classList.remove('hidden');
        if (userGreeting) userGreeting.textContent = `Hola, ${usuario.nombre}`;
    } else {
        loginContainer.classList.remove('hidden');
        userProfileContainer.classList.add('hidden');
    }

    const logoutButton = userProfileContainer.querySelector('.logout-button');
    if (logoutButton) logoutButton.addEventListener('click', logout);
}

// --- LÓGICA DE FORMULARIOS Y CANVAS ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const toRegisterBtn = document.getElementById('toRegister');
    const toLoginBtn = document.getElementById('toLogin');
    const toRegisterMobileBtn = document.getElementById('toRegisterMobile');
    const toLoginMobileBtn = document.getElementById('toLoginMobile');
    const canvas = document.getElementById('bg');

    if (toRegisterBtn) toRegisterBtn.addEventListener('click', () => container.classList.add("active"));
    if (toLoginBtn) toLoginBtn.addEventListener('click', () => container.classList.remove("active"));
    if (toRegisterMobileBtn) toRegisterMobileBtn.addEventListener('click', () => container.classList.add("active"));
    if (toLoginMobileBtn) toLoginMobileBtn.addEventListener('click', () => container.classList.remove("active"));
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Funciones de formulario
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    async function handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        const messageEl = document.getElementById('login-message');
        
        if (login(email, password)) {
            messageEl.textContent = '¡Inicio de sesión exitoso!';
            messageEl.classList.add('success');
        } else {
            messageEl.textContent = 'Email o contraseña incorrectos.';
            messageEl.classList.remove('success');
        }
    }

    async function handleRegister(event) {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const messageEl = document.getElementById('register-message');
        const users = getUsers();
        
        if (users.some(u => u.email === email)) {
            messageEl.textContent = 'El email ya está registrado.';
            messageEl.classList.remove('success');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        messageEl.textContent = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        messageEl.classList.add('success');
    }

    // --- LÓGICA DEL CANVAS ---
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, pixels = [], animationFrameId;
        function resize() { 
            W = canvas.width = window.innerWidth; 
            H = canvas.height = window.innerHeight; 
        }
        resize();
        window.addEventListener('resize', resize);
        for (let x = -400; x < 400; x += 6) { 
            for (let z = -250; z < 250; z += 6) { 
                pixels.push({ x: x, y: 100, z: z }); 
            } 
        }
        function render(ts) {
            ctx.fillStyle = '#1a1a1a'; 
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#39FF14';
            const fov = 250; 
            const len = pixels.length; 
            let pixel, scale, x2d, y2d;
            for (let i = 0; i < len; i++) {
                pixel = pixels[i]; 
                scale = fov / (fov + pixel.z);
                x2d = pixel.x * scale + W / 2; 
                y2d = pixel.y * scale + H / 2;
                if (x2d >= 0 && x2d <= W && y2d >= 0 && y2d <= H) { 
                    ctx.fillRect(x2d, y2d, 2, 2); 
                }
                pixel.z -= 0.6; 
                pixel.y = H / 14 + Math.sin(i / len * 15 + (ts / 450)) * 10;
                if (pixel.z < -fov) pixel.z += 500;
            }
            animationFrameId = window.requestAnimationFrame(render);
        }
        render(0);
    }
});