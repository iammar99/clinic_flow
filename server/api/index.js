// Vercel serverless entry point.
// Unlike server.js (used for local dev), this does NOT call app.listen()
// or sequelize.sync() — Vercel just invokes the Express app per request,
// and the database schema is expected to already exist (created once via `npm run seed`
// pointed at your production DATABASE_URL).
const app = require('../src/app');

module.exports = app;