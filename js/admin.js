// admin.js
import { productos } from './products.js';
import { $ } from './utils.js';
import { usuario, isUserLoggedIn, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!isUserLoggedIn()) {
        alert('Debes iniciar sesión para acceder al panel de administración.');
        window.location.href = '../pages/auth.html';
        return;
    }

    const userGreeting = $('#user-greeting');
    if (userGreeting) userGreeting.textContent = `Hola, ${usuario.nombre}`;

    const logoutBtn = $('#logoutButton');
    if (logoutBtn) logoutBtn.addEventListener('click', () => logout());

    const form = $('#addProductForm');
    const messageEl = $('#productMessage');
    const previewImg = $('#previewImage');
    const imgFileInput = $('#productImageFile');
    const imgURLInput = $('#productImageURL');
    const categoriaSelect = $('#productCategory');
    const subcategoriaSelect = $('#productSubcategory');
    const topProductsList = $('#topProducts');

    const subcategorias = {
        "Juegos": ["Juegos de Mesa", "Videojuegos", "Cartas"],
        "Perifericos": ["Mouse Gamer", "Teclados", "Auriculares", "Controles"],
        "Consolas": ["PlayStation", "Xbox", "Nintendo"],
        "Computacion": ["PC Escritorio", "Laptop", "Componentes"],
        "Sillas Gamer": ["Secretlab", "DXRacer", "Cougar"],
        "Accesorios": ["Mousepad", "Audífonos", "Cables"],
        "Poleras Personalizadas": ["Otras"]
    };

    categoriaSelect.addEventListener('change', () => {
        const cat = categoriaSelect.value;
        subcategoriaSelect.innerHTML = '<option value="">-- Selecciona una subcategoría --</option>';
        if (subcategorias[cat]) {
            subcategorias[cat].forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subcategoriaSelect.appendChild(opt);
            });
        }
    });

    function updatePreview(src) {
        if (src) {
            previewImg.src = src;
            previewImg.classList.remove('hidden');
        } else {
            previewImg.src = '';
            previewImg.classList.add('hidden');
        }
    }

    imgFileInput.addEventListener('change', () => {
        const file = imgFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => updatePreview(reader.result);
            reader.readAsDataURL(file);
        }
    });

    imgURLInput.addEventListener('input', () => {
        updatePreview(imgURLInput.value.trim());
    });

    function renderTopProducts() {
        const top = [...productos].sort((a, b) => b.precio - a.precio).slice(0, 5);
        topProductsList.innerHTML = '';
        top.forEach(prod => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-2 bg-gray-700 p-2 rounded';
            const img = document.createElement('img');
            if (!prod.imagen.startsWith('data:') && !prod.imagen.startsWith('http')) {
                img.src = `../${prod.imagen}`;
            } else {
                img.src = prod.imagen;
            }
            img.alt = prod.nombre;
            img.className = 'w-12 h-12 object-cover rounded';
            const span = document.createElement('span');
            span.textContent = `${prod.nombre} - $${prod.precio.toLocaleString()}`;
            li.appendChild(img);
            li.appendChild(span);
            topProductsList.appendChild(li);
        });
    }

    renderTopProducts();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = form.productName.value.trim();
        const descripcion = form.productDescription.value.trim();
        const precio = parseFloat(form.productPrice.value);
        const categoria = categoriaSelect.value;
        const subcategoria = subcategoriaSelect.value;

        if (!nombre || !descripcion || isNaN(precio) || !categoria || !subcategoria) {
            messageEl.textContent = 'Todos los campos obligatorios deben completarse.';
            messageEl.classList.remove('success');
            return;
        }

        const codigo = 'NP' + Date.now();

        function addProduct(imagen) {
            const nuevoProducto = { codigo, nombre, descripcion, precio, categoria, subcategoria, imagen };
            productos.push(nuevoProducto);
            messageEl.textContent = `Producto "${nombre}" agregado correctamente.`;
            messageEl.classList.add('success');
            form.reset();
            previewImg.src = '';
            previewImg.classList.add('hidden');
            subcategoriaSelect.innerHTML = '<option value="">-- Selecciona una subcategoría --</option>';
            renderTopProducts();
        }

        if (imgFileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => addProduct(reader.result);
            reader.readAsDataURL(imgFileInput.files[0]);
        } else if (imgURLInput.value.trim()) {
            addProduct(imgURLInput.value.trim());
        } else {
            addProduct('');
        }
    });
});
