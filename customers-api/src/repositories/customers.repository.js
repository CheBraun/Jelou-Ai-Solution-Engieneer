const db = require('../config/db');

async function createCustomer({ name, email, phone }) {
  const [result] = await db.execute(
    'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone]
  );
  return { id: result.insertId, name, email, phone };
}

async function getCustomerById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM customers WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function getCustomerByEmail(email) {
  const [rows] = await db.execute(
    'SELECT * FROM customers WHERE email = ?',
    [email]
  );
  return rows[0];
}

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomerByEmail,
};