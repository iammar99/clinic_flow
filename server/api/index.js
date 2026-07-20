// Vercel serverless entry point.
// Unlike server.js (used for local dev), this does NOT call app.listen()
// or sequelize.sync() — Vercel just invokes the Express app per request,
// and the database schema is expected to already exist (created once via `npm run seed`
// pointed at your production DATABASE_URL).

// Vercel's bundler can't detect Sequelize's dynamic `require('pg')` internally,
// so we require it explicitly here to force it into the deployed function bundle.
require('pg');
require('pg-hstore');

const app = require('../src/app');

module.exports = app;// Vercel serverless entry point.
// Unlike server.js (used for local dev), this does NOT call app.listen()
// or sequelize.sync() — Vercel just invokes the Express app per request,
// and the database schema is expected to already exist (created once via `npm run seed`
// pointed at your production DATABASE_URL).

// Vercel's bundler can't detect Sequelize's dynamic `require('pg')` internally,
// so we require it explicitly here to force it into the deployed function bundle.
require('pg');
require('pg-hstore');

const app = require('../src/app');

module.exports = app;