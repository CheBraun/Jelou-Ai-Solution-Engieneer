const axios = require('axios');

const BASE_URL = process.env.CUSTOMERS_API_BASE || 'http://localhost:3001';
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || 'internal-token';

async function getCustomerInternal(customerId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/internal/customers/${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${SERVICE_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (err) {
  if (err.response && err.response.status === 404) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }

  // 👇 IMPORTANTE: no ocultar error real
  const error = new Error(
    err.response?.data?.message || err.message || 'Error validating customer'
  );

  error.status = err.response?.status || 500;
  throw error;
  }
}

module.exports = {
  getCustomerInternal,
};