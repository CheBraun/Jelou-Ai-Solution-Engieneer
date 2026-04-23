require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const CUSTOMERS_API = process.env.CUSTOMERS_API_BASE;
const ORDERS_API = process.env.ORDERS_API_BASE;

app.post('/orchestrator/create-and-confirm-order', async (req, res) => {
  try {
    const { customer_id, items } = req.body;

    // 1. validar cliente
    await axios.get(
      `${CUSTOMERS_API}/api/internal/customers/${customer_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SERVICE_TOKEN}`,
        },
      }
    );

    // 2. crear orden
    const orderResponse = await axios.post(
      `${ORDERS_API}/api/orders`,
      { customer_id, items }
    );

    const order = orderResponse.data;

    // 3. confirmar orden (idempotente)
    const confirmResponse = await axios.post(
      `${ORDERS_API}/api/orders/${order.id}/confirm`,
      {},
      {
        headers: {
          'X-Idempotency-Key': `lambda-${Date.now()}`,
        },
      }
    );

    res.json({
      order,
      confirmation: confirmResponse.data,
    });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      message: err.message,
      details: err.response?.data || null,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Lambda Orchestrator running on port ${PORT}`);
});