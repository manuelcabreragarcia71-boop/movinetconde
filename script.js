// --- CONFIGURACIÓN INICIAL ---
// Cargamos productos del "Servidor" (LocalStorage) o usamos los predeterminados
let productos = JSON.parse(localStorage.getItem('movinet_productos')) || [
    { id: 1, nombre: "iPhone 13 Reacondicionado", precio: 450, img: "📱" },
    { id: 2, nombre: "Funda Silicona Pro", precio: 15, img: "🛡️" },
    { id: 3, nombre: "Cargador Rápido 20W", precio: 25, img: "🔌" },
    { id: 4, nombre: "Auriculares Inalámbricos", precio: 35, img: "🎧" }
];

let carrito = [];
let esAdmin = false;
const PASS_ADMIN = "4354";

// ⚠️ PON AQUÍ TU NÚMERO DE WHATSAPP (Con el 34 delante si es España)
const MI_TELEFONO = "34613509309"; 

// --- FUNCIONES DEL SISTEMA ---

// 1. Renderizar (Dibujar) los productos en la pantalla
function mostrarProductos() {
    const contenedor = document.getElementById('productos-container');
    contenedor.innerHTML = ""; 

    productos.forEach(prod => {
        const div = document.createElement('div');
        div.className = "product-card";
        div.innerHTML = `
            <span class="product-img">${prod.img}</span>
            <h3>${prod.nombre}</h3>
            <p class="price">${prod.precio}€</p>
            <button class="btn-primary full-width" onclick="agregarCarrito(${prod.id})">Comprar</button>
            ${esAdmin ? `<button class="btn-delete" onclick="eliminarProducto(${prod.id})"><i class="fas fa-trash"></i></button>` : ''}
        `;
        contenedor.appendChild(div);
    });
}

// 2. Lógica del Carrito
function agregarCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarritoUI();
    alert(`Has añadido: ${producto.nombre}`);
}

function actualizarCarritoUI() {
    document.getElementById('cart-count').innerText = carrito.length;
    
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    document.getElementById('total-price').innerText = total;

    const lista = document.getElementById('cart-items');
    lista.innerHTML = "";
    carrito.forEach((item, index) => {
        lista.innerHTML += `<li>${item.nombre} - <strong>${item.precio}€</strong> <span onclick="eliminarDelCarrito(${index})" style="color:red; cursor:pointer;">(x)</span></li>`;
    });
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function realizarPedido() {
    if (carrito.length === 0) return alert("Tu carrito está vacío");
    
    // Generar mensaje de pedido
    let mensaje = "👋 Hola MOVINETCONDE, quiero comprar estos productos: \n\n";
    carrito.forEach(p => mensaje += `▪️ ${p.nombre} (${p.precio}€)\n`);
    const total = document.getElementById('total-price').innerText;
    mensaje += `\n💰 *Total a pagar: ${total}€*`;
    
    // Abrir WhatsApp Web
    enviarWhatsApp(mensaje);
    
    carrito = []; 
    actualizarCarritoUI();
    cerrarCarrito();
}

// 3. Sistema de Administración (Login)
function verificarAdmin() {
    const inputPass = document.getElementById('adminPass').value;
    if (inputPass === PASS_ADMIN) {
        esAdmin = true;
        document.getElementById('admin-panel').classList.remove('hidden');
        cerrarLogin();
        mostrarProductos(); 
        alert("¡Hola Conde! Modo Administrador activado.");
    } else {
        alert("Contraseña incorrecta");
    }
}

function cerrarSesion() {
    esAdmin = false;
    document.getElementById('admin-panel').classList.add('hidden');
    mostrarProductos();
}

// Añadir nuevo producto 
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nuevoProd = {
        id: Date.now(), 
        img: document.getElementById('newImg').value,
        nombre: document.getElementById('newName').value,
        precio: Number(document.getElementById('newPrice').value)
    };

    productos.push(nuevoProd);
    guardarEnBaseDeDatos(); 
    mostrarProductos();
    this.reset();
});

function eliminarProducto(id) {
    if(confirm("¿Seguro que quieres borrar este producto?")) {
        productos = productos.filter(p => p.id !== id);
        guardarEnBaseDeDatos();
        mostrarProductos();
    }
}

function guardarEnBaseDeDatos() {
    localStorage.setItem('movinet_productos', JSON.stringify(productos));
}

// 4. NUEVO: Envío de Presupuesto por WhatsApp
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('clienteNombre').value;
    const modelo = document.getElementById('clienteModelo').value;
    const problema = document.getElementById('clienteProblema').value;

    // Crear el mensaje bonito para WhatsApp
    const mensaje = `🔧 *SOLICITUD DE REPARACIÓN*\n\n` +
                    `👤 *Cliente:* ${nombre}\n` +
                    `📱 *Dispositivo:* ${modelo}\n` +
                    `⚠️ *Problema:* ${problema}\n\n` +
                    `Por favor, ¿podrían darme un presupuesto?`;

    // Enviar a WhatsApp
    enviarWhatsApp(mensaje);
});

// Función auxiliar para abrir WhatsApp
function enviarWhatsApp(texto) {
    const url = `https://wa.me/${MI_TELEFONO}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// 5. Utilidades de Modales
function abrirLogin() { document.getElementById('login-modal').classList.remove('hidden'); }
function cerrarLogin() { document.getElementById('login-modal').classList.add('hidden'); }
function abrirCarrito() { document.getElementById('cart-modal').classList.remove('hidden'); }
function cerrarCarrito() { document.getElementById('cart-modal').classList.add('hidden'); }

// Inicializar
mostrarProductos();