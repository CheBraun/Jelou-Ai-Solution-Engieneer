const service = require('../services/orders.service');

async function createOrder(req, res, next) {
  try {
    const order = await service.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
};