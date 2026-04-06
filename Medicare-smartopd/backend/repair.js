const { sequelize } = require('./src/config/db');

async function repair() {
  try {
    const [counts] = await sequelize.query('SELECT count(*) FROM "Doctors" WHERE specialization IS NULL');
    console.log('NULL Specializations:', counts[0].count);
    
    // Also let's check other tables just in case
    await sequelize.query('UPDATE "Doctors" SET specialization = \'General\' WHERE specialization IS NULL');
    
    // Also let's force the password update again
    const { User } = require('./src/models');
    await User.update({ password: 'Password123' }, { where: {} });
    console.log('Force reset all passwords to Password123 in', sequelize.config.database);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

repair();
