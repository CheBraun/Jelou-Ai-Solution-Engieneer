require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'orders-api' });
});

const productsRoutes = require('./routes/products.routes');

app.use('/api', productsRoutes);

// middleware de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const ordersRoutes = require('./routes/orders.routes');

app.use('/api', ordersRoutes);

module.exports = app;