const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const server = require('../src/server');

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
  await db.closePool();
});

describe('Orders API', () => {
  it('should create an order successfully', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        customer_id: 1,
        items: [
          {
            product_id: 4,
            qty: 1
          }
        ]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('total_cents');
    expect(res.body.items.length).toBe(1);
  });

  it('should be idempotent when confirming order with same key', async () => {
  // 1. Crear orden
  const orderRes = await request(app)
    .post('/api/orders')
    .send({
      customer_id: 1,
      items: [{ product_id: 4, qty: 1 }]
    });

  const orderId = orderRes.body.id;

  // 2. Primera confirmación
  const res1 = await request(app)
    .post(`/api/orders/${orderId}/confirm`)
    .set('X-Idempotency-Key', 'test-key-123');

  // 3. Segunda confirmación (misma key)
  const res2 = await request(app)
    .post(`/api/orders/${orderId}/confirm`)
    .set('X-Idempotency-Key', 'test-key-123');

  // 4. Validaciones
  expect(res1.statusCode).toBe(200);
  expect(res2.statusCode).toBe(200);

  expect(res1.body).toEqual(res2.body);
  expect(res1.body.status).toBe('CONFIRMED');
});
  
});