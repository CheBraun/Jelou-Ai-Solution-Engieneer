const service = require('../services/orders.confirm.service');

async function confirmOrder(req, res, next) {
  try {
    const idempotencyKey = req.header('X-Idempotency-Key');
    const result = await service.confirmOrder(req.params.id, idempotencyKey);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  confirmOrder,
};