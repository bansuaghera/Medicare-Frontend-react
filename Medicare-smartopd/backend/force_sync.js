const { sequelize } = require('./src/config/db');
const User = require('./src/models/User');
const Doctor = require('./src/models/Doctor');
const Patient = require('./src/models/Patient');
const Staff = require('./src/models/Staff');
const Appointment = require('./src/models/Appointment');

async function resetDb() {
  try {
    await sequelize.authenticate();
    console.log('Force Syncing all models...');
    await sequelize.sync({ force: true });
    
    // Recreate the basic admin user since force: true wipes everything
    await User.create({
      name: 'System Admin',
      email: 'dhirajjdabhi1@gmail.com',
      password: 'Dhiraj@123',
      role: 'admin'
    });
    
    console.log('Database RESET and SYNCED successfully.');
  } catch (err) {
    console.error('Reset failed:', err);
  } finally {
    await sequelize.close();
  }
}

resetDb();
