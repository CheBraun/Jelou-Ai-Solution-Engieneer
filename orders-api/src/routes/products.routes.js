const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');

router.post('/products', controller.createProduct);
router.get('/products/:id', controller.getProductById);
router.patch('/products/:id', controller.updateProduct);

module.exports = router;