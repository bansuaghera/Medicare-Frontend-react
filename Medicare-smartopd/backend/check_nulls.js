const { sequelize } = require('./src/config/db');

async function checkNulls() {
  try {
    const [counts] = await sequelize.query('SELECT count(*) FROM "Doctors" WHERE specialization IS NULL');
    console.log('NULL Specializations:', counts[0].count);
    
    const [counts2] = await sequelize.query('SELECT count(*) FROM "Doctors" WHERE "experienceYears" IS NULL');
    console.log('NULL experienceYears:', counts2[0].count);

    const [counts3] = await sequelize.query('SELECT count(*) FROM "Doctors" WHERE "opdFees" IS NULL');
    console.log('NULL opdFees:', counts3[0].count);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkNulls();
