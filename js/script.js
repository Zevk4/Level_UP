/*****************************************
 * Level-Up Gamer — script.js
 * - Catálogo (lista) con filtros por ?cat & ?sub
 * - Detalle de producto (suma 1 vista)
 * - Carrito (localStorage)
 * - Lo más visto (localStorage vistas)
 ******************************************/
const IN_PAGES = /\/pages\//.test(location.pathname);
const PATH = {
  ASSET_BASE: IN_PAGES ? '..' : '.',
  INDEX:      IN_PAGES ? '../index.html' : 'index.html',
  PRODUCTO:   IN_PAGES ? 'producto.html' : 'pages/producto.html',
  CATEGORIA:  IN_PAGES ? 'categoria.html' : 'pages/categoria.html', // abajo forzamos a usar INDEX
};

const asset = (p) => `${PATH.ASSET_BASE}/${p}`; // asset('assets/...')

/* ===== 1) Datos ===== */
const productos = [
  { codigo:'JM001', imagen:'assets/img/product/JM001.webp', categoria:'Juegos',       subcategoria:'Juegos de Mesa', nombre:'Catan',                              precio:29990,  descripcion:'Juego clásico de estrategia y comercio.' },
  { codigo:'JM002', imagen:'assets/img/product/JM002.webp', categoria:'Juegos',       subcategoria:'Juegos de Mesa', nombre:'Carcassonne',                        precio:24990,  descripcion:'Juego de losetas para crear paisajes y competir.' },
  { codigo:'AC001', imagen:'assets/img/product/AC001.webp', categoria:'Perifericos',  subcategoria:'Controles',      nombre:'Control Inalámbrico Xbox Series X', precio:59990,  descripcion:'Control inalámbrico para Xbox Series X y PC.' },
  { codigo:'AC002', imagen:'assets/img/product/AC002.webp', categoria:'Perifericos',  subcategoria:'Auriculares Gamer', nombre:'Auriculares Gamer HyperX Cloud II', precio:79990,  descripcion:'Sonido envolvente con micrófono desmontable y máxima comodidad.' },
  { codigo:'CO001', imagen:'assets/img/product/CO001.webp', categoria:'Consolas',     subcategoria:'PlayStation',    nombre:'PlayStation 5',                     precio:549990, descripcion:'Consola de nueva generación con gráficos y carga ultrarrápida.' },
  { codigo:'CG001', imagen:'assets/img/product/CG001.webp', categoria:'Computacion',  subcategoria:'PC Escritorio',  nombre:'PC ASUS ROG Strix G10',             precio:1299990,descripcion:'PC de alto rendimiento diseñado para gamers exigentes.' },
  { codigo:'SG001', imagen:'assets/img/product/SG001.webp', categoria:'Sillas Gamer', subcategoria:'Secretlab',      nombre:'Silla Gamer Secretlab Titan',       precio:349990, descripcion:'Silla ergonómica con soporte ajustable para largas sesiones.' },
  { codigo:'MO001', imagen:'assets/img/product/MO001.webp', categoria:'Perifericos',  subcategoria:'Mouse Gamer',    nombre:'Mouse Logitech G502 HERO',          precio:49990,  descripcion:'Sensor avanzado y botones personalizables.' },
  { codigo:'MP001', imagen:'assets/img/product/MP001.webp', categoria:'Accesorios',   subcategoria:'Mousepad',       nombre:'Razer Goliathus Extended Chroma',   precio:29990,  descripcion:'Superficie amplia con iluminación RGB.' },
  { codigo:'PP001', imagen:'assets/img/product/PP001.webp', categoria:'Poleras Personalizadas', subcategoria:'Otras', nombre:'Polera Gamer "Level Up"',          precio:14990,  descripcion:'Personalizable con tu gamer tag o diseño.' }
];

/* ===== 2) Estado ===== */
const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
let usuario = null;

/* ===== 3) Vistas (Lo más visto) ===== */
const LS_VIEWS_KEY = 'levelup_views_v1';
const loadViews = () => { try { return JSON.parse(localStorage.getItem(LS_VIEWS_KEY)) || {}; } catch { return {}; } };
const saveViews = (map) => localStorage.setItem(LS_VIEWS_KEY, JSON.stringify(map));
const addView = (code) => { const m = loadViews(); m[code] = (m[code] || 0) + 1; saveViews(m); return m[code]; };
const getViews = (code) => (loadViews()[code] || 0);
function getTopViewed(arr, topN=8){
  const map = loadViews();
  const withViews = arr.map(p => ({ ...p, vistas: map[p.codigo] || 0 }));
  withViews.sort((a,b) => b.vistas - a.vistas || a.nombre.localeCompare(b.nombre));
  return withViews.slice(0, topN);
}

/* ===== 4) Utils ===== */
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const CLP = (n) => n.toLocaleString('es-CL', { style:'currency', currency:'CLP' });
const esDuoc = (email) => /@duoc\.cl$/i.test(email||'');
const qs = new URLSearchParams(location.search);

/* ===== 5) Catálogo (lista) ===== */
function renderCatalogo(){
  const grid = $('.catalogo');
  if(!grid) return;
  grid.innerHTML = '';

  const catParam = (qs.get('cat') || '').trim();
  const subParam = (qs.get('sub') || '').trim();
  const eq = (a,b)=> a && b && a.toLowerCase()===b.toLowerCase();

  let lista = productos;
  if(catParam && subParam)      lista = productos.filter(p => eq(p.categoria,catParam) && eq(p.subcategoria,subParam));
  else if(catParam)             lista = productos.filter(p => eq(p.categoria,catParam));

  const h3 = $('#productos h3');
  if(h3){
    if(catParam && subParam) h3.textContent = `Categoría: ${catParam} › ${subParam}`;
    else if(catParam)        h3.textContent = `Categoría: ${catParam}`;
    else                     h3.textContent = 'Nuestros Productos';
  }

  if(lista.length===0){
    grid.innerHTML = `<p style="color:#ccc">No hay productos para “${subParam || catParam}”.</p>`;
    return;
  }

  lista.forEach(p=>{
    const a = document.createElement('a');
    a.className = 'product-card';
    a.href = `${PATH.PRODUCTO}?code=${encodeURIComponent(p.codigo)}`;
    a.innerHTML = `
      <img src="${asset(p.imagen)}" alt="${p.nombre}" loading="lazy" width="300" height="300">
      <h4><b>${p.nombre}</b></h4>
      <p>${p.descripcion}</p>
      <p class="precio">${CLP(p.precio)}</p>
      <div class="muted">${p.categoria} › ${p.subcategoria}</div>
    `;
    grid.appendChild(a);
  });
}

/* ===== 6) Detalle de producto ===== */
function getProductFromURL(){
  const code = qs.get('code');
  return code ? (productos.find(p => p.codigo === code) || null) : null;
}

function renderDetalleProducto(){
  const host = $('#productDetailView');
  if(!host) return;

  const p = getProductFromURL();
  if(!p){ host.innerHTML = `<p style="color:#ccc">Producto no encontrado.</p>`; return; }

  const vistasActuales = addView(p.codigo);

  host.innerHTML = `
    <nav class="breadcrumbs" style="margin:14px 0;color:#9aa">
      <a href="${PATH.INDEX}" style="color:#9aa">Inicio</a> ›
      <a href="${PATH.CATEGORIA}?cat=${encodeURIComponent(p.categoria)}#productos" style="color:#9aa">${p.categoria}</a> ›
      <a href="${PATH.CATEGORIA}?cat=${encodeURIComponent(p.categoria)}&sub=${encodeURIComponent(p.subcategoria)}#productos" style="color:#9aa">${p.subcategoria}</a> ›
      <span>${p.nombre}</span>
    </nav>

    <article class="product-detail" style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start">
      <div class="media" style="background:#111;border:1px solid #333;border-radius:10px;padding:10px;position:relative;">
        <span style="position:absolute;left:10px;top:10px;background:#2d5f98;color:#fff;padding:6px 10px;border-radius:8px;font-weight:700;font-size:.85rem;">
          ${vistasActuales} visitas
        </span>
        <img src="${asset(p.imagen)}" alt="${p.nombre}" loading="lazy" style="width:100%;height:auto;object-fit:cover;border-radius:8px">
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
          <a href="${PATH.CATEGORIA}?cat=${encodeURIComponent(p.categoria)}&sub=${encodeURIComponent(p.subcategoria)}#productos"
             class="btn ghost" style="border:1px solid #1E90FF;padding:10px 16px;border-radius:8px;text-decoration:none;color:#fff">
            Volver al catálogo
          </a>
        </div>
      </div>
    </article>
  `;

  $('#addDetail').addEventListener('click', () => {
    const qty = Math.max(1, parseInt($('#qty').value || '1', 10));
    const line = carrito.find(x => x.codigo === p.codigo);
    if (line) line.qty += qty;
    else carrito.push({ codigo:p.codigo, nombre:p.nombre, precio:p.precio, imagen:p.imagen, qty });

    renderCart();
    if ($('#cartDrawer')) abrirCarrito();
    else alert(`Agregado: ${p.nombre} x${qty}\nTotal ítems: ${carrito.reduce((a,b)=>a+b.qty,0)}`);
  });
}

/* ===== 7) Carrito ===== */
const drawer = $('#cartDrawer');
const btnCart = $('.carrito-compra');
const cartItems = $('#cartItems');
const subtotalEl = $('#subtotal');
const duocEl = $('#duoc');
const totalEl = $('#total');
const closeCartBtn = $('#closeCart');
const checkoutBtn = $('#checkout');

function abrirCarrito(){ if(drawer){ drawer.hidden=false; drawer.setAttribute('open',''); renderCart(); } }
function cerrarCarrito(){ if(drawer){ drawer.hidden=true; drawer.removeAttribute('open'); } }

function renderCart(){
  if(!cartItems || !subtotalEl || !duocEl || !totalEl) return;
  cartItems.innerHTML = '';
  let subtotal = 0;

  carrito.forEach(it=>{
    subtotal += it.precio * it.qty;
    const row = document.createElement('div');
    row.className = 'cart-line';
    row.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
        <img src="${asset(it.imagen)}" alt="${it.nombre}" loading="lazy" width="64" height="48" style="object-fit:cover;border-radius:6px">
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

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

btnCart && btnCart.addEventListener('click', abrirCarrito);
closeCartBtn && closeCartBtn.addEventListener('click', cerrarCarrito);
cartItems && cartItems.addEventListener('click', (e)=>{
  const menos = e.target.closest('.menos');
  const mas   = e.target.closest('.mas');
  const del   = e.target.closest('.del');
  if(!menos && !mas && !del) return;
  const code = (menos||mas||del).getAttribute('data-code');
  const idx = carrito.findIndex(x=>x.codigo===code);
  if(idx<0) return;
  if(menos) carrito[idx].qty = Math.max(1, carrito[idx].qty - 1);
  if(mas)   carrito[idx].qty += 1;
  if(del)   carrito.splice(idx,1);
  renderCart();
});
checkoutBtn && checkoutBtn.addEventListener('click', ()=>{
  if(carrito.length===0){ alert('Tu carrito está vacío.'); return; }
  const total = carrito.reduce((a,b)=>a+b.precio*b.qty,0);
  carrito.length = 0; renderCart();
  alert(`¡Compra simulada por ${CLP(total)}!`);
  localStorage.removeItem('carrito');
});

/* ===== 8) Registro ===== */
const regModal = $('#registerModal');
const regForm  = $('#registerForm');
const regMsg   = $('#regMsg');
const btnSesion= $('.button-sesion');

const calcEdad = (iso)=>{
  const d=new Date(iso), h=new Date();
  let e = h.getFullYear()-d.getFullYear();
  const m = h.getMonth()-d.getMonth();
  if(m<0 || (m===0 && h.getDate()<d.getDate())) e--;
  return e;
};

btnSesion && btnSesion.addEventListener('click', ()=> regModal ? regModal.showModal() : alert('Aquí irá el registro (modal) con validación +18 y @duoc.cl') );
regForm && regForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd=new FormData(regForm);
  const nombre=(fd.get('nombre')||'').toString().trim();
  const correo=(fd.get('correo')||'').toString().trim();
  const fecha = fd.get('fecha');

  if(regMsg) regMsg.textContent='';
  if(!nombre){ regMsg.textContent='Ingresa tu nombre.'; return; }
  if(!correo){ regMsg.textContent='Ingresa tu correo.'; return; }
  if(!fecha){  regMsg.textContent='Selecciona tu fecha de nacimiento.'; return; }
  if(calcEdad(fecha)<18){ regMsg.textContent='Debes ser mayor de 18 años.'; return; }

  usuario = {nombre,correo,fecha};
  regMsg.textContent = esDuoc(correo) ? '¡Descuento DUOC 20% activado!' : '¡Registro exitoso!';
  setTimeout(()=> regModal && regModal.close(), 700);
  renderCart();
});

/* ===== 9) Lo más visto ===== */
function renderMasVisto(){
  const track = $('#mvTrack');
  const dots  = $('#mvDots');
  if(!track || !dots) return;

  const top = getTopViewed(productos, 8);
  track.innerHTML = '';

  top.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'mv-card';
    card.innerHTML = `
      <a href="${PATH.PRODUCTO}?code=${encodeURIComponent(p.codigo)}">
        <div class="mv-card-top">
          <span class="mv-badge">${getViews(p.codigo)} visitas</span>
          <div class="mv-media">
            <img src="${asset(p.imagen)}" alt="${p.nombre}" loading="lazy">
          </div>
        </div>
        <div class="mv-body">
          <div class="mv-title">${p.nombre}</div>
          <div class="mv-sub">${p.descripcion}</div>
          <div class="mv-price">${CLP(p.precio)}</div>
        </div>
      </a>
    `;
    track.appendChild(card);
  });

  const cards = track.querySelectorAll('.mv-card');
  const perView = (()=>{
    const w = window.innerWidth;
    if(w<=600) return 1; if(w<=900) return 2; if(w<=1200) return 3; return 4;
  })();
  const pages = Math.max(1, Math.ceil(cards.length / perView));

  dots.innerHTML = '';
  for(let i=0;i<pages;i++){
    const d = document.createElement('span');
    d.className = 'mv-dot' + (i===0 ? ' active' : '');
    d.dataset.page = String(i);
    dots.appendChild(d);
  }

  const prev = $('.mv-prev');
  const next = $('.mv-next');
  let page = 0;

  function goto(pIndex){
    page = Math.max(0, Math.min(pIndex, pages-1));
    const cardW = cards[0]?.getBoundingClientRect().width ?? 0;
    const gap = 18;
    const offset = page * (perView*cardW + perView*gap - gap);
    track.scrollTo({ left: offset, behavior:'smooth' });
    [...dots.children].forEach((el,i)=> el.classList.toggle('active', i===page));
  }

  prev?.addEventListener('click', ()=> goto(page-1));
  next?.addEventListener('click', ()=> goto(page+1));
  dots.addEventListener('click', (e)=>{
    const dot = e.target.closest('.mv-dot'); if(!dot) return;
    goto(Number(dot.dataset.page));
  });

  // Re-render en resize (recalcula perView/pages)
  let rAF;
  window.addEventListener('resize', ()=>{
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(renderMasVisto);
  }, { passive:true });
}

/* ===== 10) Init ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  if($('.catalogo'))          renderCatalogo();
  if($('#productDetailView')) renderDetalleProducto();
  if($('#mvTrack'))           renderMasVisto();

  const y = $('#year'); if(y) y.textContent = new Date().getFullYear();
});
