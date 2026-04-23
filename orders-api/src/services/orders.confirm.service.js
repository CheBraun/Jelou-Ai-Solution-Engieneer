const db = require('../config/db');

async function confirmOrder(orderId, idempotencyKey) {
  if (!idempotencyKey) {
    const err = new Error('Missing idempotency key');
    err.status = 400;
    throw err;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // verificar si ya existe la key
    const [existing] = await connection.execute(
      'SELECT * FROM idempotency_keys WHERE idempotency_key = ?',
      [idempotencyKey]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return existing[0].response_body;
    }

    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? FOR UPDATE',
      [orderId]
    );

    const order = orders[0];

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'CONFIRMED') {
      const response = {
        id: order.id,
        status: order.status,
        total_cents: order.total_cents,
      };

      await connection.execute(
        `INSERT INTO idempotency_keys (idempotency_key, target_type, target_id, status, response_body)
         VALUES (?, 'order_confirm', ?, 'done', ?)`,
        [idempotencyKey, orderId, JSON.stringify(response)]
      );

      await connection.commit();
      return response;
    }

    await connection.execute(
      'UPDATE orders SET status = "CONFIRMED" WHERE id = ?',
      [orderId]
    );

    const response = {
      id: order.id,
      status: 'CONFIRMED',
      total_cents: order.total_cents,
    };

    await connection.execute(
      `INSERT INTO idempotency_keys (idempotency_key, target_type, target_id, status, response_body)
       VALUES (?, 'order_confirm', ?, 'done', ?)`,
      [idempotencyKey, orderId, JSON.stringify(response)]
    );

    await connection.commit();

    return response;
  } catch (err) {
    await connection.rollback();
    err.status = err.status || 400;
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  confirmOrder,
};