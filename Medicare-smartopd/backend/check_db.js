const { sequelize } = require('./src/config/db');

async function check() {
  try {
    const [doctors] = await sequelize.query('SELECT * FROM "Doctors"');
    console.log(JSON.stringify(doctors, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
