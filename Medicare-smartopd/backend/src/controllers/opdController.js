const OPDSchedule = require('../models/OPDSchedule');
const User = require('../models/User');

// @desc Create a new OPD schedule
// @route POST /api/opd/schedule
exports.createSchedule = async (req, res) => {
    try {
        const schedule = await OPDSchedule.create(req.body);
        res.status(201).json({ success: true, message: 'Schedule created successfully', data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Get all OPD schedules
// @route GET /api/opd/schedule
exports.getAllSchedules = async (req, res) => {
    try {
        const { doctorId } = req.query;
        let where = {};
        if (doctorId) where.doctorId = doctorId;

        const schedules = await OPDSchedule.findAll({
            where,
            include: [{ model: User, as: 'doctor', attributes: ['name', 'email'] }],
            order: [['startTime', 'ASC']]
        });
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Delete a schedule
// @route DELETE /api/opd/schedule/:id
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await OPDSchedule.destroy({ where: { id } });
        if (!result) return res.status(404).json({ success: false, message: 'Schedule not found' });
        res.status(200).json({ success: true, message: 'Schedule deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc Delete multiple schedules
// @route POST /api/opd/schedule/bulk-delete
exports.deleteMultipleSchedules = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No schedule IDs provided' });
    }
    await OPDSchedule.destroy({ where: { id: ids } });
    res.status(200).json({ success: true, message: `${ids.length} shifts removed from roster.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bulk removal failed', error: error.message });
  }
};
