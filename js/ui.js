/**
 * ------------------------------------------------------------------------
 * Módulo de Interfaz de Usuario (ui.js)
 * ------------------------------------------------------------------------
 * Responsabilidades:
 * - Renderizar componentes visuales como el catálogo, detalle de producto, etc.
 * - Manejar la lógica de "lo más visto".
 * ------------------------------------------------------------------------
 */

import { $, CLP } from './utils.js';
import { PATH, asset } from './config.js';
import { agregarAlCarrito } from './cart.js';

// --- LÓGICA DE "LO MÁS VISTO" (INTERNA DEL MÓDULO) ---

const LS_VIEWS_KEY = 'levelup_views_v1';
const loadViews = () => { try { return JSON.parse(localStorage.getItem(LS_VIEWS_KEY)) || {}; } catch { return {}; } };
const saveViews = (map) => localStorage.setItem(LS_VIEWS_KEY, JSON.stringify(map));
const addView = (code) => { const m = loadViews(); m[code] = (m[code] || 0) + 1; saveViews(m); return m[code]; };
const getViews = (code) => (loadViews()[code] || 0);

function getTopViewed(productos, topN = 8) {
    const map = loadViews();
    const withViews = productos.map(p => ({ ...p, vistas: map[p.codigo] || 0 }));
    withViews.sort((a, b) => b.vistas - a.vistas || a.nombre.localeCompare(b.nombre));
    return withViews.slice(0, topN);
}

// --- FUNCIONES DE RENDERIZADO (EXPORTADAS) ---

export function renderCatalogo(productos) {
    const grid = $('.catalogo');
    if (!grid) return;
    grid.innerHTML = '';

    const qs = new URLSearchParams(location.search);
    const catParam = (qs.get('cat') || '').trim();
    const subParam = (qs.get('sub') || '').trim();
    const eq = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();

    let lista = productos;
    if (catParam && subParam) lista = productos.filter(p => eq(p.categoria, catParam) && eq(p.subcategoria, subParam));
    else if (catParam) lista = productos.filter(p => eq(p.categoria, catParam));

    const h3 = $('#productos h3');
    if (h3) {
        if (catParam && subParam) h3.textContent = `Categoría: ${catParam} › ${subParam}`;
        else if (catParam) h3.textContent = `Categoría: ${catParam}`;
        else h3.textContent = 'Nuestros Productos';
    }

    if (lista.length === 0) {
        grid.innerHTML = `<p style="color:#ccc">No hay productos para “${subParam || catParam}”.</p>`;
        return;
    }

    lista.forEach(p => {
        const a = document.createElement('a');
        a.className = 'product-card';
        a.href = `${PATH.PRODUCTO}?code=${encodeURIComponent(p.codigo)}`;
        a.innerHTML = `
            <img src="${asset(p.imagen)}" alt="${p.nombre}" loading="lazy" width="300" height="300">
            <h4><b>${p.nombre}</b></h4>
            <p>${p.descripcion}</p>
            <p class="precio">${CLP(p.precio)}</p>
            <div class="muted">${p.categoria} › ${p.subcategoria}</div>`;
        grid.appendChild(a);
    });
}


export function renderDetalleProducto(productos) {
    const host = $('#productDetailView');
    if (!host) return;

    const qs = new URLSearchParams(location.search);
    const code = qs.get('code');
    const p = code ? (productos.find(prod => prod.codigo === code) || null) : null;
    
    if (!p) { 
        host.innerHTML = `<p style="color:#ccc">Producto no encontrado.</p>`; 
        return; 
    }

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
        <h2 style="margin-top:0"><b>${p.nombre}</b></h2>
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
    
    // Asignamos el evento al botón recién creado
    $('#addDetail').addEventListener('click', () => {
        const qty = Math.max(1, parseInt($('#qty').value || '1', 10));
        agregarAlCarrito(p, qty);
    });
}

/* ===== 9) Lo más visto ===== */
export function renderMasVisto(productos) {
  const track = $('#mvTrack');
  const dots = $('#mvDots');
  if (!track || !dots) return;

  const top = getTopViewed(productos, 8);
  track.innerHTML = '';

  top.forEach(p => {
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
  const perView = (() => {
    const w = window.innerWidth;
    if (w <= 600) return 1; if (w <= 900) return 2; if (w <= 1200) return 3; return 4;
  })();
  const pages = Math.max(1, Math.ceil(cards.length / perView));

  dots.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('span');
    d.className = 'mv-dot' + (i === 0 ? ' active' : '');
    d.dataset.page = String(i);
    dots.appendChild(d);
  }

  const prev = $('.mv-prev');
  const next = $('.mv-next');
  let page = 0;

  function goto(pIndex) {
    page = Math.max(0, Math.min(pIndex, pages - 1));
    const cardW = cards[0]?.getBoundingClientRect().width ?? 0;
    const gap = 18;
    const offset = page * (perView * cardW + perView * gap - gap);
    track.scrollTo({ left: offset, behavior: 'smooth' });
    [...dots.children].forEach((el, i) => el.classList.toggle('active', i === page));
  }

  prev?.addEventListener('click', () => goto(page - 1));
  next?.addEventListener('click', () => goto(page + 1));
  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.mv-dot'); if (!dot) return;
    goto(Number(dot.dataset.page));
  });

  // Re-render en resize (recalcula perView/pages)
  let rAF;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(renderMasVisto);
  }, { passive: true });
}


// ------------------------------------------------------------------------
// Lógica para el buscador
// ------------------------------------------------------------------------
export function renderSearchResults(results) {
    const container = $('.search-results');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron resultados.</p>';
        return;
    }

    const html = results.map(p => `
        <a href="${PATH.PRODUCTO}?code=${encodeURIComponent(p.codigo)}" class="search-result-item">
            <img src="${asset(p.imagen)}" alt="${p.nombre}">
            <div class="info">
                <div class="name">${p.nombre}</div>
                <div class="price">${CLP(p.precio)}</div>
            </div>
        </a>
    `).join('');

    container.innerHTML = html;
}