/*****************************************
 * Level-Up Gamer — script.js (catálogo + detalle)
 * - Catálogo: cards clicables sin botón "Agregar"
 * - Detalle: cantidad + botón "Agregar"
 * - Carrito (drawer opcional si existe en el HTML)
 ******************************************/


// ====== 1) Datos en memoria ======
const productos = [
    { codigo: 'JM001', imagen: '../assets/img/product/JM001.webp', categoria: 'Juegos', subcategoria: 'Juegos de Mesa', nombre: 'Catan', precio: 29990, descripcion: 'Juego clásico de estrategia y comercio.' },
    { codigo: 'JM002', imagen: '../assets/img/product/JM002.webp', categoria: 'Juegos', subcategoria: 'Juegos de Mesa', nombre: 'Carcassonne', precio: 24990, descripcion: 'Juego de losetas para crear paisajes y competir.' },
    { codigo: 'AC001', imagen: '../assets/img/product/AC001.webp', categoria: 'Perifericos', subcategoria: 'Controles', nombre: 'Control Inalámbrico Xbox Series X', precio: 59990, descripcion: 'Control inalámbrico para Xbox Series X y PC.' },
    { codigo: 'AC002', imagen: '../assets/img/product/AC002.webp', categoria: 'Perifericos', subcategoria: 'Auriculares Gamer', nombre: 'Auriculares Gamer HyperX Cloud II', precio: 79990, descripcion: 'Sonido envolvente con micrófono desmontable y máxima comodidad.' },
    { codigo: 'CO001', imagen: '../assets/img/product/CO001.webp', categoria: 'Consolas', subcategoria: 'PlayStation', nombre: 'PlayStation 5', precio: 549990, descripcion: 'Consola de nueva generación con gráficos y carga ultrarrápida.' },
    { codigo: 'CG001', imagen: '../assets/img/product/CG001.webp', categoria: 'Computacion', subcategoria: 'PC Escritorio', nombre: 'PC ASUS ROG Strix G10 ', precio: 1299990, descripcion: 'PC de alto rendimiento diseñado para gamers exigentes.' },
    { codigo: 'SG001', imagen: '../assets/img/product/SG001.webp', categoria: 'Sillas Gamer', subcategoria: 'Secretlab', nombre: 'Silla Gamer Secretlab Titan', precio: 349990, descripcion: 'Silla ergonómica con soporte ajustable para largas sesiones.' },
    { codigo: 'MO001', imagen: '../assets/img/product/MO001.webp', categoria: 'Perifericos', subcategoria: 'Mouse Gamer', nombre: 'Mouse Logitech G502 HERO', precio: 49990, descripcion: 'Sensor avanzado y botones personalizables.' },
    { codigo: 'MP001', imagen: '../assets/img/product/MP001.webp', categoria: 'Accesorios', subcategoria: 'Mousepad', nombre: 'Razer Goliathus Extended Chroma', precio: 29990, descripcion: 'Superficie amplia con iluminación RGB.' },
    { codigo: 'PP001', imagen: '../assets/img/product/PP001.webp', categoria: 'Poleras Personalizadas', subcategoria: 'Otras', nombre: 'Polera Gamer "Level Up"', precio: 14990, descripcion: 'Personalizable con tu gamer tag o diseño.' }
];

// ===== Lo más visto (dataset de ejemplo) =====
const masVisto = [
  {
    codigo:'CG001',
    titulo:'PC ASUS ROG Strix G10',
    sub:'I7 13900K / Nvidia RTX 3070 / 16 GB GDDR6',
    precio: 1299990,
    visitas: 119,
    img: '../assets/img/product/CG001.webp', // pon tu asset
  },
  {
    codigo:'SG001',
    titulo:'Silla Gamer Secretlab Titan',
    sub:'Silla ergonómica con soporte ajustable para largas sesiones.',
    precio: 349990,
    visitas: 79,
    img: '../assets/img/product/SG001.webp',
  },
  {
    codigo:'MO001',
    titulo:'Mouse Logitech G502 HERO',
    sub:'Sensor avanzado y botones personalizables.',
    precio: 49990,
    visitas: 55,
    img: '../assets/img/product/MO001.webp',
  },
  {
    codigo:'PP001',
    titulo:'Polera Gamer "Level Up',
    sub:'Personalizable con tu gamer tag o diseño.',
    precio: 14990,
    visitas: 47,
    img: '../assets/img/product/PP001.webp',
  },
   {
    codigo:'AC002',
    titulo:'Auriculares HyperX Cloud II',
    sub:'Sonido envolvente con micrófono desmontable y máxima comodidad.',
    precio: 79990,
    visitas: 36,
    img: '../assets/img/product/AC002.webp',
  },
  // puedes agregar más; el slider hará scroll por páginas
];

// ====== 2) Estado ======
const carrito = []; // { codigo, nombre, precio, imagen, qty }
let usuario = null;

// ====== 3) Utils ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const CLP = (n) => n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
const esDuoc = (email) => /@duoc\.cl$/i.test(email || '');
const qs = new URLSearchParams(location.search);

// ====== 4) Catálogo (lista) ======
function renderCatalogo() {
  const grid = document.querySelector('.catalogo');
  if (!grid) return;
  grid.innerHTML = '';

  const params = new URLSearchParams(location.search);
  const catParam = (params.get('cat') || '').trim();
  const subParam = (params.get('sub') || '').trim();

  // Normaliza (case-insensitive)
  const eq = (a,b) => a && b && a.toLowerCase() === b.toLowerCase();

  let lista = productos;
  if (catParam && subParam) {
    lista = productos.filter(p => eq(p.categoria, catParam) && eq(p.subcategoria, subParam));
  } else if (catParam) {
    lista = productos.filter(p => eq(p.categoria, catParam));
  }

  // Título dinámico
  const h3 = document.querySelector('#productos h3');
  if (h3) {
    if (catParam && subParam) h3.textContent = `Categoría: ${catParam} › ${subParam}`;
    else if (catParam)       h3.textContent = `Categoría: ${catParam}`;
    else                     h3.textContent = 'Nuestros Productos';
  }

  if (lista.length === 0) {
    grid.innerHTML = `<p style="color:#ccc">No hay productos para “${subParam || catParam}”.</p>`;
    return;
  }

  // Cards clicables → producto.html
  lista.forEach(p => {
    const a = document.createElement('a');
    a.className = 'product-card';
    a.href = `../pages/producto.html?code=${encodeURIComponent(p.codigo)}`;
    a.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" width="300" height="300">
      <h4><b>${p.nombre}</b></h4>
      <p>${p.descripcion}</p>
      <p class="precio">${CLP(p.precio)}</p>
      <div class="muted">${p.categoria} › ${p.subcategoria}</div>
    `;
    grid.appendChild(a);
  });
}


// ====== 5) Detalle de producto ======
function getProductFromURL() {
    const code = qs.get('code');
    if (!code) return null;
    return productos.find(p => p.codigo === code) || null;
}

function renderDetalleProducto() {
    const host = $('#productDetailView');
    if (!host) return;

    const p = getProductFromURL();
    if (!p) {
        host.innerHTML = `<p style="color:#ccc">Producto no encontrado.</p>`;
        return;
    }

    host.innerHTML = `
    <nav class="breadcrumbs" style="margin:14px 0;color:#9aa">
      <a href="${'index.html#productos'}" style="color:#9aa">Inicio</a> ›
      <a href="../pages/categoria.html?cat=${encodeURIComponent(p.categoria)}#productos" style="color:#9aa">
      ${p.categoria}
      </a> ›
      <a href="${`index.html?cat=${encodeURIComponent(p.categoria)}&sub=${encodeURIComponent(p.subcategoria)}#productos`}" style="color:#9aa">${p.subcategoria}</a> ›
      <span>${p.nombre}</span>
    </nav>

    <article class="product-detail" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">
      <div class="media" style="background:#111;border:1px solid #333;border-radius:10px;padding:10px">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" style="width:100%;height:auto;object-fit:cover;border-radius:8px">
      </div>

      <div class="info">
        <h2 style="margin-top:0">${p.nombre}</h2>
        <div class="muted" style="margin:6px 0 14px">${p.categoria}</div>
        <div class="price" style="font-size:1.6rem;font-weight:700;color:#39FF14">${CLP(p.precio)}</div>
        <p style="color:#ddd;margin:10px 0 16px">${p.descripcion}</p>

        <label style="display:block;margin:10px 0;color:#cfc">
          Cantidad
          <input id="qty" type="number" min="1" value="1"
                 style="display:block;margin-top:6px;width:120px;background:#0d0d0d;border:1px solid #333;color:#fff;padding:8px;border-radius:8px">
        </label>

        <div style="display:flex;gap:10px;margin-top:10px">
          <button id="addDetail" type="button" class="add-to-cart-btn"
                  style="background:#39FF14;color:#001a00;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;font-weight:700">
            Agregar al carrito
          </button>
          <a href="../pages/categoria.html?cat=${encodeURIComponent(p.categoria)}#productos" class="btn ghost" style="border:1px solid #1E90FF;padding:10px 16px;border-radius:8px;text-decoration:none;color:#fff">
            Volver al catálogo
          </a>
        </div>
      </div>
    </article>
  `;

    // Evento Agregar
    $('#addDetail').addEventListener('click', () => {
        const qty = Math.max(1, parseInt($('#qty').value || '1', 10));
        const line = carrito.find(x => x.codigo === p.codigo);
        if (line) line.qty += qty;
        else carrito.push({ codigo: p.codigo, nombre: p.nombre, precio: p.precio, imagen: p.imagen, qty });

        renderCart();
        // Si tienes drawer, lo abrimos; si no, alert:
        if ($('#cartDrawer')) abrirCarrito();
        else alert(`Agregado: ${p.nombre} x${qty}\nTotal ítems: ${carrito.reduce((a, b) => a + b.qty, 0)}`);
    });
}

// ====== 6) Carrito (drawer opcional) ======
const drawer = $('#cartDrawer');
const btnCart = $('.carrito-compra'); // botón del header
const cartItems = $('#cartItems');
const subtotalEl = $('#subtotal');
const duocEl = $('#duoc');
const totalEl = $('#total');
const closeCartBtn = $('#closeCart');
const checkoutBtn = $('#checkout');

function abrirCarrito() { if (drawer) { drawer.hidden = false; drawer.setAttribute('open', ''); renderCart(); } }
function cerrarCarrito() { if (drawer) { drawer.hidden = true; drawer.removeAttribute('open'); } }

function renderCart() {
    if (!cartItems || !subtotalEl || !duocEl || !totalEl) return;
    cartItems.innerHTML = '';
    let subtotal = 0;

    carrito.forEach(it => {
        subtotal += it.precio * it.qty;
        const row = document.createElement('div');
        row.className = 'cart-line';
        row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
        <img src="${it.imagen}" alt="${it.nombre}" loading="lazy" width="64" height="48" style="object-fit:cover;border-radius:6px">
        <div>
          <div><strong>${it.nombre}</strong></div>
          <div class="muted">${CLP(it.precio)} — Cant. ${it.qty}</div>
        </div>
        <div style="margin-left:auto">
          <button type="button" class="menos" data-code="${it.codigo}">−</button>
          <button type="button" class="mas" data-code="${it.codigo}">＋</button>
          <button type="button" class="del" data-code="${it.codigo}">🗑</button>
        </div>
      </div>
    `;
        cartItems.appendChild(row);
    });

    const descuento = usuario && esDuoc(usuario.correo) ? Math.round(subtotal * 0.20) : 0;
    subtotalEl.textContent = CLP(subtotal);
    duocEl.textContent = descuento ? `- ${CLP(descuento)}` : CLP(0);
    totalEl.textContent = CLP(Math.max(0, subtotal - descuento));
}

// Carrito events
btnCart && btnCart.addEventListener('click', abrirCarrito);
closeCartBtn && closeCartBtn.addEventListener('click', cerrarCarrito);

cartItems && cartItems.addEventListener('click', (e) => {
    const menos = e.target.closest('.menos');
    const mas = e.target.closest('.mas');
    const del = e.target.closest('.del');
    if (!menos && !mas && !del) return;

    const code = (menos || mas || del).getAttribute('data-code');
    const idx = carrito.findIndex(x => x.codigo === code);
    if (idx < 0) return;

    if (menos) carrito[idx].qty = Math.max(1, carrito[idx].qty - 1);
    if (mas) carrito[idx].qty += 1;
    if (del) carrito.splice(idx, 1);

    renderCart();
});

checkoutBtn && checkoutBtn.addEventListener('click', () => {
    if (carrito.length === 0) { alert('Tu carrito está vacío.'); return; }
    const total = carrito.reduce((a, b) => a + b.precio * b.qty, 0);
    carrito.length = 0;
    renderCart();
    alert(`¡Compra simulada por ${CLP(total)}!`);
});

// ====== 7) Registro (opcional, si agregas modal) ======
const regModal = $('#registerModal');
const regForm = $('#registerForm');
const regMsg = $('#regMsg');
const btnSesion = $('.button-sesion');

function calcEdad(iso) {
    const d = new Date(iso), h = new Date();
    let e = h.getFullYear() - d.getFullYear();
    const m = h.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && h.getDate() < d.getDate())) e--;
    return e;
}

btnSesion && btnSesion.addEventListener('click', () => {
    if (regModal) regModal.showModal();
    else alert('Aquí irá el registro (modal) con validación +18 y @duoc.cl');
});

regForm && regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(regForm);
    const nombre = (fd.get('nombre') || '').toString().trim();
    const correo = (fd.get('correo') || '').toString().trim();
    const fecha = fd.get('fecha');

    if (regMsg) regMsg.textContent = '';
    if (!nombre) { regMsg && (regMsg.textContent = 'Ingresa tu nombre.'); return; }
    if (!correo) { regMsg && (regMsg.textContent = 'Ingresa tu correo.'); return; }
    if (!fecha) { regMsg && (regMsg.textContent = 'Selecciona tu fecha de nacimiento.'); return; }
    if (calcEdad(fecha) < 18) { regMsg && (regMsg.textContent = 'Debes ser mayor de 18 años.'); return; }

    usuario = { nombre, correo, fecha };
    regMsg && (regMsg.textContent = esDuoc(correo) ? '¡Descuento DUOC 20% activado!' : '¡Registro exitoso!');
    setTimeout(() => regModal && regModal.close(), 700);
    renderCart();
});

// ====== 8) Mega-menú accesible ======
(function initMegaMenu() {
    const container = $('.menu-container');
    if (!container) return;
    const trigger = container.querySelector('.menu-trigger');
    const menu = container.querySelector('.mega-menu');
    if (!trigger || !menu) return;

    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!open));
        menu.style.display = open ? 'none' : 'flex';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { trigger.setAttribute('aria-expanded', 'false'); menu.style.display = 'none'; }
    });

    container.addEventListener('mouseenter', () => { menu.style.display = 'flex'; });
    container.addEventListener('mouseleave', () => { menu.style.display = 'none'; trigger.setAttribute('aria-expanded', 'false'); });
})();

// ====== 9) Init ======
document.addEventListener('DOMContentLoaded', () => {
    // Si hay catálogo, pinto lista; si hay detalle, pinto detalle
    if ($('.catalogo')) renderCatalogo();
    if ($('#productDetailView')) renderDetalleProducto();

    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
});



// Render “Lo más visto”
function renderMasVisto() {
  const track = document.getElementById('mvTrack');
  const dots  = document.getElementById('mvDots');
  if (!track || !dots) return;

  track.innerHTML = '';
  masVisto.forEach(item => {
    const card = document.createElement('div');
    card.className = 'mv-card';
    card.innerHTML = `
      <a href="${item.link}" target="_blank" rel="noopener">
        <div class="mv-card-top">
          <span class="mv-badge">${item.visitas} visitas</span>
          <div class="mv-media">
            <img src="${(typeof asset==='function') ? asset(item.img) : item.img}" alt="${item.titulo}" loading="lazy">
          </div>
        </div>
        <div class="mv-body">
          <div class="mv-title">${item.titulo}</div>
          <div class="mv-sub">${item.sub}</div>
          <div class="mv-price">${CLP(item.precio)}</div>
        </div>
      </a>
    `;
    track.appendChild(card);
  });

  // Pagination dots (por página visible)
  const cards = track.querySelectorAll('.mv-card');
  const perView = getPerView(); // 4/3/2/1 según media query
  const pages = Math.max(1, Math.ceil(cards.length / perView));

  dots.innerHTML = '';
  for (let i=0; i<pages; i++) {
    const d = document.createElement('span');
    d.className = 'mv-dot' + (i===0 ? ' active' : '');
    d.dataset.page = String(i);
    dots.appendChild(d);
  }

  // Navegación
  const prev = document.querySelector('.mv-prev');
  const next = document.querySelector('.mv-next');
  let page = 0;

  function getPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    if (w <= 1200) return 3;
    return 4;
  }

  function goto(p) {
    page = Math.max(0, Math.min(p, pages-1));
    const cardW = cards[0]?.getBoundingClientRect().width ?? 0;
    const gap   = 18; // mismo gap que en CSS
    const offset = page * (perView * cardW + perView * gap - gap);
    track.scrollTo({ left: offset, behavior:'smooth' });
    [...dots.children].forEach((el,i)=> el.classList.toggle('active', i===page));
  }

  prev?.addEventListener('click', () => goto(page-1));
  next?.addEventListener('click', () => goto(page+1));

  // Dots click
  dots.addEventListener('click', (e)=>{
    const dot = e.target.closest('.mv-dot');
    if (!dot) return;
    goto(Number(dot.dataset.page));
  });

  // Recalcular al redimensionar
  let rAF; 
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(renderMasVisto); // re-render para recalcular perView/dots
  }, { passive:true });
}

// Llama al render al iniciar (si la sección existe)
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('mvTrack')) renderMasVisto();
});
