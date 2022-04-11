require('dotenv').config({ path: 'example/.env' });

module.exports = {
  hostname: 'localhost',
  color: true,
  browserInitTimeout: 20000,
  selectorTimeout: 10000,
  assertionTimeout: 10000,
  pageLoadTimeout: 10000,
  pageRequestTimeout: 10000,
};
