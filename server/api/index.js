// Vercel serverless entry point.
require('pg');
require('pg-hstore');

const app = require('../src/app');

module.exports = app;