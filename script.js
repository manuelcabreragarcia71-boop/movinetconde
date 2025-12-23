// --- 1. IMPORTACIONES CORRECTAS PARA NAVEGADOR (NO BORRAR NI CAMBIAR) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- 2. TU CONFIGURACIÓN (TUS CLAVES REALES) ---
const firebaseConfig = {
    apiKey: "AIzaSyAO9sshvU5zUf_S9d12toWwrioeXBonlRc",
    authDomain: "movinet-conde-web.firebaseapp.com",
    projectId: "movinet-conde-web",
    storageBucket: "movinet-conde-web.firebasestorage.app",
    messagingSenderId: "867268264562",
    appId: "1:867268264562:web:f28e33585cdcde3d8e78eb",
    measurementId: "G-71BM6J8SFL"
};

// --- 3. INICIALIZAR LA APP ---
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
const db = getFirestore(app);
const productsCollection = collection(db, "productos"); 

// --- 4. VARIABLES GLOBALES ---
let carrito = [];
let esAdmin = false;
const PASS_ADMIN = "4354"; 

// ⚠️⚠️⚠️ PON TU TELÉFONO AQUÍ (Borra el mío) ⚠️⚠️⚠️
const MI_TELEFONO = "34613509309"; 

// --- 5. FUNCIONES ---

// Importante: Usamos "window." para que el HTML pueda ver las funciones
window.mostrarProductos = async function() {
    const contenedor = document.getElementById('productos-container');
    if(!contenedor) return; // Evita errores si no ha cargado la página
    
    contenedor.innerHTML = '<p style="text-align:center">Cargando catálogo...</p>'; 

    try {
        const querySnapshot = await getDocs(productsCollection);
        contenedor.innerHTML = ""; 
        
        if (querySnapshot.empty) {
            contenedor.innerHTML = '<p style="text-align:center">No hay productos. ¡Entra como Admin y añade uno!</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const prod = doc.data();
            const prodId = doc.id;
            
            const div = document.createElement('div');
            div.className = "product-card";
            div.innerHTML = `
                <span class="product-img">${prod.img}</span>
                <h3>${prod.nombre}</h3>
                <p class="price">${prod.precio}€</p>
                <button class="btn-primary full-width" onclick="agregarCarrito('${prodId}', '${prod.nombre}', ${prod.precio})">Comprar</button>
                ${esAdmin ? `<button class="btn-delete" onclick="eliminarProducto('${prodId}')"><i class="fas fa-trash"></i></button>` : ''}
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error de conexión. Revisa la consola.</p>";
    }
}

// Carrito
window.agregarCarrito = function(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    actualizarCarritoUI();
    alert(`Has añadido: ${nombre}`);
}

function actualizarCarritoUI() {
    const contador = document.getElementById('cart-count');
    const totalElem = document.getElementById('total-price');
    const lista = document.getElementById('cart-items');

    if(contador) contador.innerText = carrito.length;
    
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    if(totalElem) totalElem.innerText = total;

    if(lista) {
        lista.innerHTML = "";
        carrito.forEach((item, index) => {
            lista.innerHTML += `<li>${item.nombre} - <strong>${item.precio}€</strong> <span onclick="eliminarDelCarrito(${index})" style="color:red; cursor:pointer;">(x)</span></li>`;
        });
    }
}

window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

window.realizarPedido = function() {
    if (carrito.length === 0) return alert("Tu carrito está vacío");
    let mensaje = "👋 Hola MOVINETCONDE, quiero comprar: \n\n";
    carrito.forEach(p => mensaje += `▪️ ${p.nombre} (${p.precio}€)\n`);
    const total = document.getElementById('total-price').innerText;
    mensaje += `\n💰 *Total a pagar: ${total}€*`;
    window.enviarWhatsApp(mensaje);
    carrito = []; 
    actualizarCarritoUI();
    window.cerrarCarrito();
}

// Admin y Login
window.verificarAdmin = function() {
    const inputPass = document.getElementById('adminPass').value;
    if (inputPass === PASS_ADMIN) {
        esAdmin = true;
        document.getElementById('admin-panel').classList.remove('hidden');
        window.cerrarLogin();
        window.mostrarProductos();
        alert("¡Conectado como Admin!");
    } else {
        alert("Contraseña incorrecta");
    }
}

window.cerrarSesion = function() {
    esAdmin = false;
    document.getElementById('admin-panel').classList.add('hidden');
    window.mostrarProductos();
}

// Añadir Producto a la Nube
const formProducto = document.getElementById('addProductForm');
if(formProducto) {
    formProducto.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nuevoProd = {
            img: document.getElementById('newImg').value,
            nombre: document.getElementById('newName').value,
            precio: Number(document.getElementById('newPrice').value),
            fecha: new Date()
        };
        try {
            await addDoc(productsCollection, nuevoProd);
            alert("✅ Producto guardado");
            window.mostrarProductos();
            this.reset();
        } catch (e) {
            alert("Error: " + e.message);
        }
    });
}

window.eliminarProducto = async function(id) {
    if(confirm("¿Borrar permanentemente?")) {
        try {
            await deleteDoc(doc(db, "productos", id));
            window.mostrarProductos();
        } catch (e) {
            alert("Error: " + e.message);
        }
    }
}

// Utilidades
window.enviarWhatsApp = function(texto) {
    const url = `https://wa.me/${MI_TELEFONO}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

window.abrirLogin = function() { document.getElementById('login-modal').classList.remove('hidden'); }
window.cerrarLogin = function() { document.getElementById('login-modal').classList.add('hidden'); }
window.abrirCarrito = function() { document.getElementById('cart-modal').classList.remove('hidden'); }
window.cerrarCarrito = function() { document.getElementById('cart-modal').classList.add('hidden'); }

// Contact Form
const formContact = document.getElementById('contactForm');
if(formContact) {
    formContact.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('clienteNombre').value;
        const modelo = document.getElementById('clienteModelo').value;
        const problema = document.getElementById('clienteProblema').value;
        const mensaje = `🔧 *SOLICITUD REPARACIÓN*\n👤: ${nombre}\n📱: ${modelo}\n⚠️: ${problema}`;
        window.enviarWhatsApp(mensaje);
    });
}

// Arrancar
window.mostrarProductos();