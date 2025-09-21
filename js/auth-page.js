// Este es el código que me enviaste, ahora dedicado exclusivamente a la página de autenticación.
document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORES Y LISTENERS DE LA INTERFAZ ---
    const container = document.getElementById('container');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const toRegisterBtn = document.getElementById('toRegister');
    const toLoginBtn = document.getElementById('toLogin');
    const toRegisterMobileBtn = document.getElementById('toRegisterMobile');
    const toLoginMobileBtn = document.getElementById('toLoginMobile');
    const canvas = document.getElementById('bg');

    // Asignación de eventos
    if (toRegisterBtn) toRegisterBtn.addEventListener('click', () => container.classList.add("active"));
    if (toLoginBtn) toLoginBtn.addEventListener('click', () => container.classList.remove("active"));
    if (toRegisterMobileBtn) toRegisterMobileBtn.addEventListener('click', () => container.classList.add("active"));
    if (toLoginMobileBtn) toLoginMobileBtn.addEventListener('click', () => container.classList.remove("active"));
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // --- LÓGICA DE AUTENTICACIÓN ---
    function getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // -- Formulario de Registro --
    async function handleRegister(event) {
        event.preventDefault();
        const form = event.target;
        const button = form.querySelector('button');
        const messageEl = document.getElementById('register-message');
        const nombre = form.nombre.value;
        const email = form.email.value;
        const password = form.password.value;

        if (!nombre.trim() || !email.trim() || !password.trim()) {
            messageEl.textContent = 'Todos los campos son obligatorios.';
            return;
        }
        if (/\s/.test(email) || /\s/.test(password)) {
            messageEl.textContent = 'El email y la contraseña no pueden contener espacios.';
            return;
        }

        button.disabled = true;
        button.textContent = 'Registrando...';
        messageEl.textContent = '';
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const users = getUsers();
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                messageEl.textContent = 'El correo electrónico ya está registrado.';
                messageEl.classList.remove('success');
            } else {
                users.push({ nombre, email, password });
                saveUsers(users);
                messageEl.textContent = '¡Registro exitoso! Ya puedes iniciar sesión.';
                messageEl.classList.add('success');
                form.reset();
                setTimeout(() => container.classList.remove("active"), 1500);
            }
        } finally {
            button.disabled = false;
            button.textContent = 'Registrarte';
        }
    }

    // -- Formulario de Login --
    async function handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const button = form.querySelector('button');
        const messageEl = document.getElementById('login-message');
        button.disabled = true;
        button.textContent = 'Ingresando...';
        messageEl.textContent = '';
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const email = form.email.value;
            const password = form.password.value;
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                sessionStorage.setItem('loggedInUser', JSON.stringify(user));
                messageEl.textContent = '¡Inicio de sesión exitoso!';
                messageEl.classList.add('success');
                setTimeout(() => { window.location.href = '../index.html'; }, 1000);
            } else {
                messageEl.textContent = 'Email o contraseña incorrectos.';
                messageEl.classList.remove('success');
            }
        } finally {
            if (!sessionStorage.getItem('loggedInUser')) {
                button.disabled = false;
                button.textContent = 'Ingresar';
            }
        }
    }

    // --- Validación en Tiempo Real ---
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('input', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            input.style.borderColor = emailRegex.test(input.value) ? '#00DC64' : '#ff4d4d';
        });
    });
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('input', () => {
            const password = input.value;
            const isValid = password.length >= 8 && !/\s/.test(password);
            input.style.borderColor = isValid ? '#00DC64' : '#ff4d4d';
        });
    });
    // (Tu código de validación en tiempo real va aquí...)

    // --- LÓGICA DEL CANVAS ---
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W, H, pixels = [], animationFrameId;
        function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        for (let x = -400; x < 400; x += 6) { for (let z = -250; z < 250; z += 6) { pixels.push({ x: x, y: 100, z: z }); } }
        function render(ts) {
            ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#39FF14';
            const fov = 250; const len = pixels.length; let pixel, scale, x2d, y2d;
            for (let i = 0; i < len; i++) {
                pixel = pixels[i]; scale = fov / (fov + pixel.z);
                x2d = pixel.x * scale + W / 2; y2d = pixel.y * scale + H / 2;
                if (x2d >= 0 && x2d <= W && y2d >= 0 && y2d <= H) { ctx.fillRect(x2d, y2d, 2, 2); }
                pixel.z -= 0.6; pixel.y = H / 14 + Math.sin(i / len * 15 + (ts / 450)) * 10;
                if (pixel.z < -fov) { pixel.z += 2 * fov; }
            }
        }
        function drawFrame(ts) { animationFrameId = requestAnimationFrame(drawFrame); render(ts); }
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { if (!animationFrameId) { drawFrame(performance.now()); } }
            else { if (animationFrameId) { cancelAnimationFrame(animationFrameId); animationFrameId = null; } }
        });
        observer.observe(canvas);
    }
});