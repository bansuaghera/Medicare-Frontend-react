const { sequelize } = require('./src/config/db');

async function fix() {
  try {
    await sequelize.query('UPDATE "Doctors" SET specialization = \'General\' WHERE specialization IS NULL');
    await sequelize.query('UPDATE "Doctors" SET "experienceYears" = 0 WHERE "experienceYears" IS NULL');
    await sequelize.query('UPDATE "Doctors" SET "opdFees" = 200 WHERE "opdFees" IS NULL');
    console.log('Fixed doctors table');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fix();
