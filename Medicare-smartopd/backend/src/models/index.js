const User = require('./User');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Staff = require('./Staff');
const Appointment = require('./Appointment');
const OPDSchedule = require('./OPDSchedule');
const Prescription = require('./Prescription');
const Activity = require('./Activity');
const Feedback = require('./Feedback');

// Define associations
const setupAssociations = () => {
  // Doctor and User: One User has One Doctor profile
  Doctor.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasOne(Doctor, { 
    foreignKey: 'userId'
  });

  // Patient and User: One User has One Patient profile
  Patient.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasOne(Patient, { 
    foreignKey: 'userId'
  });

  // Staff and User: One User has One Staff profile
  Staff.belongsTo(User, { 
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  User.hasOne(Staff, { 
    foreignKey: 'userId'
  });

  // Activity and User: One User has many Activities
  Activity.belongsTo(User, { 
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
  User.hasMany(Activity, { 
    foreignKey: 'userId',
    as: 'activities'
  });

  // Feedback associations
  Feedback.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE'
  });
  User.hasMany(Feedback, {
    foreignKey: 'userId',
    as: 'feedbacks'
  });

  // Activity and User (relatedUser): Activity can reference another user
  Activity.belongsTo(User, { 
    foreignKey: 'relatedUserId',
    as: 'relatedUser'
  });
};

module.exports = {
  User,
  Doctor,
  Patient,
  Staff,
  Appointment,
  OPDSchedule,
  Prescription,
  Activity,
  Feedback,
  setupAssociations
};
