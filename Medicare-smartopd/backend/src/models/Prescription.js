const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Appointment = require('./Appointment');
const User = require('./User');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  appointmentId: {
    type: DataTypes.UUID,
    references: {
      model: Appointment,
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  vitals: {
    type: DataTypes.JSONB, // Stores BP, PR, RR, Temperature, Spo2
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  advice: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicines: {
    type: DataTypes.JSONB, // Stores array of medicines: [{name, dosage, duration, frequency}]
    allowNull: true
  },
  nextFollowUp: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations
Appointment.hasOne(Prescription, { foreignKey: 'appointmentId' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId' });
User.hasMany(Prescription, { as: 'MyPrescriptions', foreignKey: 'patientId' });
Prescription.belongsTo(User, { as: 'PatientRecord', foreignKey: 'patientId' });

module.exports = Prescription;
