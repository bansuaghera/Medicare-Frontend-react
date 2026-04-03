const express = require('express');
const router = express.Router();
const { getPatientPrescriptions, getPrescriptionById, saveExaminationNotes, createPrescription } = require('../controllers/prescriptionController');

router.post('/save-notes', saveExaminationNotes);
router.post('/create', createPrescription);
router.get('/patient/:patientId', getPatientPrescriptions);
router.get('/:id', getPrescriptionById);

module.exports = router;
