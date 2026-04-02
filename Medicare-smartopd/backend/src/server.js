const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, sequelize } = require('./config/db');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const opdRoutes = require('./routes/opdRoutes');

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/opd', opdRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medicare Smart OPD API' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Sync database and start server
const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Sync Models (Use { force: false } in production)
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
