const User = require('./backend/src/models/User');
const Doctor = require('./backend/src/models/Doctor');
const { sequelize } = require('./backend/src/config/db');

async function test() {
  try {
    await sequelize.authenticate();
    console.log('DB OK');
    
    // Attempt registration like the controller
    const user = await User.create({
      name: 'Test Doc',
      email: 'test@example.com',
      password: 'Password1',
      role: 'doctor'
    });
    
    console.log('User created:', user.id);
    
    await Doctor.create({
      userId: user.id,
      specialization: 'Cardiology',
      experienceYears: 5,
      opdFees: 500
    });
    
    console.log('Doctor created!');
  } catch (err) {
    console.error('FAILED:', err);
  } finally {
    await sequelize.close();
  }
}

test();
