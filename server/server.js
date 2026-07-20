const app = require('./src/app');
const sequelize = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection to PostgreSQL established successfully.');

    // Sync database models (in production, use migrations; for development/MVP, sync is perfect)
    // Note: alter: true is safe for development to update columns as model updates
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Start listening
    app.listen(PORT, () => {
      console.log(`ClinicFlow Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
}

startServer();
