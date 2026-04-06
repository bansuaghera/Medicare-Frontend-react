const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Activity = require('../models/Activity');

// @desc Book an appointment & Generate Token
// @route POST /api/appointments/book
// @access Private
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason, isEmergency } = req.body;

    // Basic Token Logic (Find max token for this date + doctor and increment)
    const lastAppointment = await Appointment.findOne({
      where: { doctorId, date },
      order: [['tokenNumber', 'DESC']]
    });

    const tokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      tokenNumber,
      reason,
      isEmergency: isEmergency || false
    });

    // Log activity for patient
    await Activity.create({
      userId: patientId,
      activityType: 'appointment_booked',
      relatedEntityType: 'appointment',
      relatedEntityId: appointment.id,
      description: `Appointment booked on ${date} at ${time}`
    }).catch(err => console.error('Error logging activity:', err));

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      token: tokenNumber,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

// @desc Get Doctor's patient queue
// @route GET /api/appointments/queue/:doctorId
// @access Private/Staff/Doctor
exports.getDoctorQueue = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query; // If date is provided, filter by date, else default to today
    
    const today = date || new Date().toISOString().split('T')[0];

    const appointments = await Appointment.findAll({
      where: { doctorId, date: today },
      include: [{ model: User, as: 'Patient', attributes: ['name', 'email'] }],
      order: [['isEmergency', 'DESC'], ['date', 'DESC'], ['time', 'ASC'], ['tokenNumber', 'ASC']]
    });

    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching queue', error: error.message });
  }
};

// @desc Update Appointment Status (Call next patient, Complete, etc)
// @route PUT /api/appointments/:id/status
// @access Private/Staff/Doctor
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Security: Verify ownership (doctor can only update their own appointments)
    // This check can be extended with authenticated user ID if middleware is added
    
    appointment.status = status;
    await appointment.save();

    // Log the event for the patient
    let activityType = 'appointment_updated';
    if (status === 'completed') activityType = 'appointment_completed';
    if (status === 'cancelled') activityType = 'appointment_cancelled';

    await Activity.create({
      userId: appointment.patientId,
      activityType,
      relatedEntityType: 'appointment',
      relatedEntityId: appointment.id,
      description: `Appointment status updated to ${status}`
    }).catch(err => console.error("Error logging appointment status activity:", err));

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// @desc General Update Appointment
// @route PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    await appointment.update(req.body);
    res.status(200).json({ success: true, message: 'Appointment updated successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// @desc Reorder Tokens (Manual Drag & Drop)
// @route POST /api/appointments/reorder
exports.reorderTokens = async (req, res) => {
  try {
    const { appointmentIds } = req.body;
    if (!appointmentIds || !Array.isArray(appointmentIds)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment IDs' });
    }

    // Sequence updates to avoid token number collisions or just overwrite
    // Usually, we should reorder for a specific subset. 
    // Here we just assign tokenNumber = index + 1
    for (let i = 0; i < appointmentIds.length; i++) {
        await Appointment.update({ tokenNumber: i + 1 }, { where: { id: appointmentIds[i] } });
    }

    res.status(200).json({ success: true, message: 'Queue reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Reorder failed', error: error.message });
  }
};

// @desc Update Emergency status
// @route PUT /api/appointments/:id/emergency
exports.updateEmergency = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEmergency } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.isEmergency = isEmergency;
    await appointment.save();

    res.status(200).json({ success: true, message: `Emergency status updated`, data: appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating emergency status', error: error.message });
  }
};

// @desc Get all appointments (Admin/Staff)
// @route GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'Doctor', attributes: ['name'] },
        { model: User, as: 'Patient', attributes: ['name'] }
      ],
      order: [['isEmergency', 'DESC'], ['date', 'DESC'], ['time', 'ASC'], ['tokenNumber', 'ASC']]
    });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get patient's own appointments
// @route GET /api/appointments/patient/:patientId
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.findAll({
      where: { patientId },
      include: [{
        model: User,
        as: 'Doctor',
        attributes: ['id', 'name', 'email'],
        include: [{ model: Doctor, attributes: ['specialization', 'experienceYears', 'opdFees'] }]
      }],
      order: [['isEmergency', 'DESC'], ['date', 'DESC'], ['time', 'ASC'], ['tokenNumber', 'ASC']]
    });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get ALL appointments for a doctor (for examination dropdown)
// @route GET /api/appointments/doctor/:doctorId
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.findAll({
      where: { doctorId },
      include: [{
        model: User,
        as: 'Patient',
        attributes: ['id', 'name', 'email']
      }],
      order: [['isEmergency', 'DESC'], ['date', 'DESC'], ['time', 'ASC'], ['tokenNumber', 'ASC']]
    });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Delete an appointment
// @route DELETE /api/appointments/:id
// @access Private/Staff/Doctor
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Log activity for patient
    await Activity.create({
      userId: appointment.patientId,
      activityType: 'appointment_cancelled',
      relatedEntityType: 'appointment',
      relatedEntityId: appointment.id,
      description: `Appointment cancelled for ${appointment.date}`
    }).catch(err => console.error('Error logging activity:', err));

    await appointment.destroy();
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
  }
};

// @desc Delete multiple appointments
// @route DELETE /api/appointments
// @access Private/Staff/Doctor
exports.deleteMultipleAppointments = async (req, res) => {
  try {
    const { appointmentIds } = req.body;

    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No appointment IDs provided' });
    }

    console.log("Attempting to delete appointments:", appointmentIds);

    const result = await Appointment.destroy({
      where: { id: appointmentIds }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found with the provided IDs'
      });
    }

    res.status(200).json({
      success: true,
      message: `${result} appointment(s) deleted successfully`,
      deletedCount: result
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: 'Error deleting appointments', error: error.message });
  }
};
// @desc Clear all appointments
// @route DELETE /api/appointments/clear-all
exports.deleteAllAppointments = async (req, res) => {
  try {
    const count = await Appointment.count();
    await Appointment.destroy({ where: {}, truncate: true });
    res.status(200).json({ success: true, message: `${count} appointments cleared successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing appointments', error: error.message });
  }
};
