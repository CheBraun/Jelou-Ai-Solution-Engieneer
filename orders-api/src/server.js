require('dotenv').config();

const app = require('./app');

const server = app.listen(process.env.PORT || 3002, () => {
  console.log(`Orders API running on port 3002`);
});

module.exports = server;