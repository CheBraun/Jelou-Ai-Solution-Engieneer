const service = require('../services/products.service');

async function createProduct(req, res, next) {
  try {
    const product = await service.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await service.getProductById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await service.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProduct,
  getProductById,
  updateProduct,
};