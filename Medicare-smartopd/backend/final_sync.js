const { sequelize } = require('./src/config/db');
const { DataTypes } = require('sequelize');

async function finalSync() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();
    const tables = ['"Users"', '"Doctors"', '"Patients"', '"Staff"', '"Appointments"'];
    
    for (const table of tables) {
      try {
        const info = await queryInterface.describeTable(table);
        const colNames = Object.keys(info);
        console.log(`Table ${table} current columns:`, colNames);
        if (!colNames.includes('updatedAt')) {
          console.log(`Adding updatedAt to ${table}`);
          await queryInterface.addColumn(table, 'updatedAt', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
          });
        }
        if (!info.createdAt) {
          console.log(`Adding createdAt to ${table}`);
          await queryInterface.addColumn(table, 'createdAt', {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
          });
        }
      } catch (e) {
        console.log(`Table ${table} not found or error: ${e.message}`);
      }
    }
    console.log('Final Sync complete.');
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}
finalSync();
