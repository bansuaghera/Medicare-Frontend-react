const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

// Import all models and setup associations
const { setupAssociations } = require('./models');
setupAssociations();

// Import models
const { Doctor, User } = require('./models');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const opdRoutes = require('./routes/opdRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const activityRoutes = require('./routes/activityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/opd', opdRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medicare Smart OPD API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Helper function to populate doctor names from Users table
const populateDoctorNames = async () => {
  try {
    // Update doctors with NULL names by joining with Users table
    const result = await sequelize.query(`
      UPDATE "Doctors" d
      SET name = u.name
      FROM "Users" u
      WHERE d."userId" = u.id AND d.name IS NULL
    `);
    console.log('Doctor names populated from Users table');
  } catch (error) {
    console.error('Error populating doctor names:', error);
  }
};

// Sync database and start server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Sync Models - alter:true adds missing columns without dropping data
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    // Populate existing doctor names from Users table
    await populateDoctorNames();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
