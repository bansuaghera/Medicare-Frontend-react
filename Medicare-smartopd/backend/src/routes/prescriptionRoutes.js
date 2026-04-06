const express = require('express');
const router = express.Router();
const { getPatientPrescriptions, getDoctorPrescriptions, getPrescriptionById, saveExaminationNotes, createPrescription, deleteMultiplePrescriptions } = require('../controllers/prescriptionController');

router.post('/save-notes', saveExaminationNotes);
router.post('/create', createPrescription);
router.get('/patient/:patientId', getPatientPrescriptions);
router.get('/doctor/:doctorId', getDoctorPrescriptions);
router.get('/:id', getPrescriptionById);
router.delete('/', deleteMultiplePrescriptions);

module.exports = router;
