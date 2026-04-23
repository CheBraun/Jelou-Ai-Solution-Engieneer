const db = require('../config/db');
const customersClient = require('./customers.client');

async function createOrder({ customer_id, items }) {
  if (!customer_id || !items || !items.length) {
    const err = new Error('Invalid order data');
    err.status = 400;
    throw err;
  }

  // validar cliente
  await customersClient.getCustomerInternal(customer_id);

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;
    const processedItems = [];

    for (const item of items) {
      const [rows] = await connection.execute(
        'SELECT * FROM products WHERE id = ? FOR UPDATE',
        [item.product_id]
      );

      const product = rows[0];

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < item.qty) {
        throw new Error('Insufficient stock');
      }

      const subtotal = product.price_cents * item.qty;
      total += subtotal;

      processedItems.push({
        product_id: product.id,
        qty: item.qty,
        unit_price_cents: product.price_cents,
        subtotal_cents: subtotal,
      });

      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.qty, product.id]
      );
    }

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_id, total_cents) VALUES (?, ?)',
      [customer_id, total]
    );

    const orderId = orderResult.insertId;

    for (const item of processedItems) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, qty, unit_price_cents, subtotal_cents)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.qty,
          item.unit_price_cents,
          item.subtotal_cents,
        ]
      );
    }

    await connection.commit();

    return {
      id: orderId,
      status: 'CREATED',
      total_cents: total,
      items: processedItems,
    };
  } catch (err) {
    await connection.rollback();
    err.status = err.status || 400;
    throw err;
  } finally {
    connection.release();
  }
}

async function cancelOrder(orderId) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // obtener orden
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? FOR UPDATE',
      [orderId]
    );

    const order = orders[0];

    if (!order) {
      const err = new Error('Order not found');
      err.status = 404;
      throw err;
    }

    // no permitir cancelar si ya está confirmada
    if (order.status === 'CONFIRMED') {
      const err = new Error('Cannot cancel a confirmed order');
      err.status = 400;
      throw err;
    }

    // obtener items
    const [items] = await connection.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // devolver stock
    for (const item of items) {
      await connection.execute(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [item.qty, item.product_id]
      );
    }

    // actualizar estado
    await connection.execute(
      'UPDATE orders SET status = "CANCELED" WHERE id = ?',
      [orderId]
    );

    await connection.commit();

    return {
      id: orderId,
      status: 'CANCELED',
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}


module.exports = {
  createOrder,
  cancelOrder,
};
