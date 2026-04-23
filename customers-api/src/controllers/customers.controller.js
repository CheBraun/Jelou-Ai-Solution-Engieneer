const customersService = require('../services/customers.service');

async function createCustomer(req, res, next) {
  try {
    const customer = await customersService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const customer = await customersService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomerInternal,
};

async function getCustomerInternal(req, res, next) {
  try {
    const customer = await customersService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
}