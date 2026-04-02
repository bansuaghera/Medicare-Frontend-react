const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc Book an appointment & Generate Token
// @route POST /api/appointments/book
// @access Private
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;

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
      reason
    });

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
      order: [['tokenNumber', 'ASC']]
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

    appointment.status = status;
    await appointment.save();

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
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
      order: [['date', 'DESC'], ['tokenNumber', 'ASC']]
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
      include: [{ model: User, as: 'Doctor', attributes: ['name'] }],
      order: [['date', 'DESC']]
    });
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

