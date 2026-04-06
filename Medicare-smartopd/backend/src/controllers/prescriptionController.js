const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc Save examination notes (vitals, symptoms, diagnosis, treatment plan)
// @route POST /api/prescriptions/save-notes
exports.saveExaminationNotes = async (req, res) => {
    try {
        const { appointmentId, doctorId, patientId, vitals, symptoms, diagnosis, treatmentPlan } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Appointment ID is required' });
        }

        // Check if a prescription already exists for this appointment
        let prescription = await Prescription.findOne({ where: { appointmentId } });

        if (prescription) {
            // Update existing record
            await prescription.update({ vitals, diagnosis, advice: treatmentPlan });
        } else {
            // Create new record with notes only
            prescription = await Prescription.create({
                appointmentId,
                doctorId,
                patientId,
                vitals,
                diagnosis: diagnosis || 'Pending',
                advice: treatmentPlan,
                medicines: []
            });
        }

        res.status(200).json({ success: true, message: 'Examination notes saved successfully', data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Create a full prescription
// @route POST /api/prescriptions/create
exports.createPrescription = async (req, res) => {
    try {
        const { appointmentId, doctorId, patientId, vitals, diagnosis, advice, medicines, nextFollowUp } = req.body;

        if (!appointmentId || !diagnosis) {
            return res.status(400).json({ success: false, message: 'Appointment ID and diagnosis are required' });
        }

        // Check if prescription already exists for this appointment
        let prescription = await Prescription.findOne({ where: { appointmentId } });

        if (prescription) {
            await prescription.update({ vitals, diagnosis, advice, medicines, nextFollowUp });
        } else {
            prescription = await Prescription.create({
                appointmentId,
                doctorId,
                patientId,
                vitals,
                diagnosis,
                advice,
                medicines: medicines || [],
                nextFollowUp
            });
        }

        const appointment = await Appointment.findByPk(appointmentId);
        if (appointment) {
            appointment.status = 'completed';
            await appointment.save();

            // Log activity for the patient
            const Activity = require('../models/Activity');
            await Activity.create({
                userId: patientId,
                activityType: 'prescription_created',
                relatedEntityType: 'prescription',
                relatedEntityId: prescription.id,
                description: `Prescription generated for appointment on ${appointment.date}`
            }).catch(err => console.error('Error logging prescription activity:', err));
        }

        res.status(201).json({ success: true, message: 'Prescription created successfully', data: prescription });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Get prescriptions for a patient
// @route GET /api/prescriptions/patient/:patientId
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;
        const prescriptions = await Prescription.findAll({
            where: { patientId },
            include: [
                { model: Appointment, attributes: ['date', 'time', 'tokenNumber'] },
                { model: User, as: 'PatientRecord', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Also get doctor name for each prescription
        const enriched = [];
        for (const rx of prescriptions) {
            const doctor = await User.findByPk(rx.doctorId, { attributes: ['name'] });
            enriched.push({
                ...rx.toJSON(),
                doctorName: doctor ? doctor.name : 'Unknown'
            });
        }

        res.status(200).json({ success: true, data: enriched });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Get a single prescription by ID
// @route GET /api/prescriptions/:id
exports.getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findByPk(id, {
            include: [
                { model: Appointment, attributes: ['date', 'time', 'tokenNumber'] }
            ]
        });
        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }
        const doctor = await User.findByPk(prescription.doctorId, { attributes: ['name'] });
        res.status(200).json({
            success: true,
            data: { ...prescription.toJSON(), doctorName: doctor ? doctor.name : 'Unknown' }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Delete multiple prescriptions
// @route DELETE /api/prescriptions
exports.deleteMultiplePrescriptions = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'Invalid IDs provided' });
        }
        await Prescription.destroy({ where: { id: ids } });
        res.status(200).json({ success: true, message: 'Records deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Get prescriptions generated by a specific doctor
// @route GET /api/prescriptions/doctor/:doctorId
exports.getDoctorPrescriptions = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const prescriptions = await Prescription.findAll({
            where: { doctorId },
            include: [
                { model: Appointment, attributes: ['date', 'time', 'tokenNumber'] },
                { model: User, as: 'PatientRecord', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
