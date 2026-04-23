const express = require('express');
const router = express.Router();
const controller = require('../controllers/orders.controller');

router.post('/orders', controller.createOrder);
const confirmController = require('../controllers/orders.confirm.controller');
router.post('/orders/:id/confirm', confirmController.confirmOrder);
module.exports = router;