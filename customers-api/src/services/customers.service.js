const customersRepo = require('../repositories/customers.repository');

async function createCustomer(data) {
  const existing = await customersRepo.getCustomerByEmail(data.email);
  if (existing) {
    const error = new Error('Email already exists');
    error.status = 409;
    throw error;
  }

  return customersRepo.createCustomer(data);
}

async function getCustomerById(id) {
  const customer = await customersRepo.getCustomerById(id);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  return customer;
}

module.exports = {
  createCustomer,
  getCustomerById,
};