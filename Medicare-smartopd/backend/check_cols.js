const { sequelize } = require('./src/config/db');
async function checkColumns() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable('Doctors');
    console.log('Columns in Doctors table:', JSON.stringify(Object.keys(tableInfo), null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}
checkColumns();
