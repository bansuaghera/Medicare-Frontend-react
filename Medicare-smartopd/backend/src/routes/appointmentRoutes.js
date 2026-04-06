const express = require('express');
const router = express.Router();
const { 
    bookAppointment, 
    getDoctorQueue, 
    updateAppointmentStatus, 
    updateAppointment,
    reorderTokens,
    getAllAppointments, 
    getPatientAppointments, 
    getDoctorAppointments, 
    deleteAppointment, 
    deleteMultipleAppointments,
    deleteAllAppointments,
    updateEmergency
} = require('../controllers/appointmentController');

// Delete routes
router.delete('/clear-all', deleteAllAppointments);
router.delete('/:id', deleteAppointment);
router.delete('/', deleteMultipleAppointments);

// Appointment routes
router.post('/book', bookAppointment);
router.get('/queue/:doctorId', getDoctorQueue);
router.get('/doctor/:doctorId', getDoctorAppointments);
router.get('/patient/:patientId', getPatientAppointments);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/emergency', updateEmergency);
router.put('/:id', updateAppointment);
router.post('/reorder', reorderTokens);
router.get('/', getAllAppointments);

module.exports = router;
