USE jelou_db;

INSERT INTO customers (name, email, phone)
VALUES
  ('ACME Corp', 'ops@acme.com', '+593999111111'),
  ('Globex', 'compras@globex.com', '+593999222222');

INSERT INTO products (sku, name, price_cents, stock)
VALUES
  ('SKU-001', 'Laptop Pro 14', 129900, 15),
  ('SKU-002', 'Monitor 27', 89900, 20),
  ('SKU-003', 'Keyboard Mechanical', 15900, 50);