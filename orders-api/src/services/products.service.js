const repo = require('../repositories/products.repository');

async function createProduct(data) {
  if (!data.sku || !data.name || data.price_cents == null) {
    const err = new Error('Invalid product data');
    err.status = 400;
    throw err;
  }
  return repo.createProduct(data);
}

async function getProductById(id) {
  const product = await repo.getProductById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return product;
}

async function updateProduct(id, data) {
  const updated = await repo.updateProduct(id, data);
  if (!updated) {
    const err = new Error('Nothing to update');
    err.status = 400;
    throw err;
  }
  return updated;
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
};