const db = require('../config/db');

async function createProduct({ sku, name, price_cents, stock }) {
  const [result] = await db.execute(
    'INSERT INTO products (sku, name, price_cents, stock) VALUES (?, ?, ?, ?)',
    [sku, name, price_cents, stock]
  );
  return { id: result.insertId, sku, name, price_cents, stock };
}

async function getProductById(id) {
  const [rows] = await db.execute(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  return rows[0];
}

async function updateProduct(id, data) {
  const fields = [];
  const values = [];

  if (data.price_cents !== undefined) {
    fields.push('price_cents = ?');
    values.push(data.price_cents);
  }

  if (data.stock !== undefined) {
    fields.push('stock = ?');
    values.push(data.stock);
  }

  if (fields.length === 0) return null;

  values.push(id);

  await db.execute(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return getProductById(id);
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
};