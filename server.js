// server.js
const express = require('express');
const cors = require('cors');
// TU CLAVE SECRETA (La que empieza por sk_test...)
const stripe = require('stripe')('sk_test_51T139I01BQr9moLGGxbWDkFJRRJitH7rVaRjUagYfliIotfCui7A5BzrmH7dGnOrPWGFC5HTZ4jx5NtOS09CCrNR00ttb3CXmu');

const app = express();
app.use(cors());
app.use(express.static('public')); 
app.use(express.json());

app.post('/crear-sesion-pago', async (req, res) => {
  try {
    const { carrito, modoEntrega } = req.body;

    // 1. Preparamos los productos
    const lineItems = carrito.map(item => {
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.n,
          },
          unit_amount: Math.round(item.p * 100), // Convertimos a céntimos
        },
        quantity: 1,
      };
    });

    // 2. Configuración base de la sesión
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:4242/index.html?estado=exito', 
      cancel_url: 'http://localhost:4242/index.html?estado=cancelado',
    };

    // 3. Lógica inteligente: ¿Pedimos dirección?
    if (modoEntrega === 'envio') {
        // Si quiere envío, obligamos a poner dirección de España
        sessionConfig.shipping_address_collection = {
            allowed_countries: ['ES'], 
        };
    }
    // Si es 'tienda', NO ponemos nada, así no pide dirección.

    // 4. Creamos la sesión
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(4242, () => console.log('Servidor corriendo en http://localhost:4242'));
