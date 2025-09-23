
/* ===== 1) Datos ===== */
export const productos = [
  { codigo: 'JM001', imagen: 'assets/img/product/JM001.webp', categoria: 'Juegos', subcategoria: 'Juegos de Mesa', nombre: 'Catan', precio: 29990, descripcion: 'Juego clásico de estrategia y comercio.' },
  { codigo: 'JM002', imagen: 'assets/img/product/JM002.webp', categoria: 'Juegos', subcategoria: 'Juegos de Mesa', nombre: 'Carcassonne', precio: 24990, descripcion: 'Juego de losetas para crear paisajes y competir.' },
  { codigo: 'AC001', imagen: 'assets/img/product/AC001.webp', categoria: 'Perifericos', subcategoria: 'Controles', nombre: 'Control Inalámbrico Xbox Series X', precio: 59990, descripcion: 'Control inalámbrico para Xbox Series X y PC.' },
  { codigo: 'AC002', imagen: 'assets/img/product/AC002.webp', categoria: 'Perifericos', subcategoria: 'Auriculares Gamer', nombre: 'Auriculares Gamer HyperX Cloud II', precio: 79990, descripcion: 'Sonido envolvente con micrófono desmontable y máxima comodidad.' },
  { codigo: 'CO001', imagen: 'assets/img/product/CO001.webp', categoria: 'Consolas', subcategoria: 'PlayStation', nombre: 'PlayStation 5', precio: 549990, descripcion: 'Consola de nueva generación con gráficos y carga ultrarrápida.' },
  { codigo: 'CO002', imagen: 'assets/img/product/CO002.webp', categoria: 'Consolas', subcategoria: 'Xbox Series', nombre: 'Xbox Serie S', precio: 599990, descripcion: 'Consola de nueva generacion con graficos y tiempos de carga muy cortos.' },
  { codigo: 'CG001', imagen: 'assets/img/product/CG001.webp', categoria: 'Computacion', subcategoria: 'PC Escritorio', nombre: 'PC ASUS ROG Strix G10', precio: 1299990, descripcion: 'PC de alto rendimiento diseñado para gamers exigentes.' },
  { codigo: 'SG001', imagen: 'assets/img/product/SG001.webp', categoria: 'Sillas Gamer', subcategoria: 'Secretlab', nombre: 'Silla Gamer Secretlab Titan', precio: 349990, descripcion: 'Silla ergonómica con soporte ajustable para largas sesiones.' },
  { codigo: 'MO001', imagen: 'assets/img/product/MO001.webp', categoria: 'Perifericos', subcategoria: 'Mouse Gamer', nombre: 'Mouse Logitech G502 HERO', precio: 49990, descripcion: 'Sensor avanzado y botones personalizables.' },
  { codigo: 'MP001', imagen: 'assets/img/product/MP001.webp', categoria: 'Accesorios', subcategoria: 'Mousepad', nombre: 'Razer Goliathus Extended Chroma', precio: 29990, descripcion: 'Superficie amplia con iluminación RGB.' },
  { codigo: 'PP001', imagen: 'assets/img/product/PP001.webp', categoria: 'Poleras Personalizadas', subcategoria: 'Otras', nombre: 'Polera Gamer "Level Up"', precio: 14990, descripcion: 'Personalizable con tu gamer tag o diseño.' }
];
export function agregarProducto(producto) {
    productos.push(producto);
}