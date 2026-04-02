const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorQueue, updateAppointmentStatus, getAllAppointments, getPatientAppointments } = require('../controllers/appointmentController');

// Appointment routes
router.post('/book', bookAppointment);
router.get('/queue/:doctorId', getDoctorQueue);
router.get('/patient/:patientId', getPatientAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.get('/', getAllAppointments);

module.exports = router;
