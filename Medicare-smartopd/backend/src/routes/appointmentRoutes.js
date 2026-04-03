const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorQueue, updateAppointmentStatus, getAllAppointments, getPatientAppointments, getDoctorAppointments } = require('../controllers/appointmentController');

// Appointment routes
router.post('/book', bookAppointment);
router.get('/queue/:doctorId', getDoctorQueue);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.get('/patient/:patientId', getPatientAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.get('/', getAllAppointments);

module.exports = router;
