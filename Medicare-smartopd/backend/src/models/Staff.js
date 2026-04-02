const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Link to root User table

const Staff = sequelize.define('Staff', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
    unique: true
  },
  staffRole: {
    type: DataTypes.STRING,
    allowNull: false, // e.g. Receptionist, Nurse, Lab Tech
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shift: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
     allowNull: true
  }
}, {
  timestamps: true
});

// Associations
User.hasOne(Staff, { foreignKey: 'userId', onDelete: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'userId' });

module.exports = Staff;
