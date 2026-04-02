const { sequelize } = require('./src/config/db');
const { DataTypes } = require('sequelize');

async function syncDb() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await sequelize.authenticate();
    console.log('Postgres Connected');

    const tableInfo = await queryInterface.describeTable('Doctors');
    console.log('Current columns:', Object.keys(tableInfo));

    const columnsToAdd = {
      licenseNumber: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      experienceYears: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      opdFees: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      availabilityStatus: { type: DataTypes.ENUM('active', 'on-leave', 'retired'), defaultValue: 'active' },
      biography: { type: DataTypes.TEXT, allowNull: true }
    };

    for (const [col, spec] of Object.entries(columnsToAdd)) {
      if (!tableInfo[col]) {
        console.log(`Adding column: ${col}`);
        await queryInterface.addColumn('Doctors', col, spec);
      }
    }

    console.log('Migration Complete');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sequelize.close();
  }
}

syncDb();
