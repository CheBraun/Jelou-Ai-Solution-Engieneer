const express = require('express');
const router = express.Router();
const controller = require('../controllers/customers.controller');

router.post('/customers', controller.createCustomer);
router.get('/customers/:id', controller.getCustomerById);
router.get('/internal/customers/:id', controller.getCustomerInternal);
module.exports = router;