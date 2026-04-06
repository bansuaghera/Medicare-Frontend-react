const express = require('express');
const router = express.Router();
const { createSchedule, getAllSchedules, deleteSchedule, deleteMultipleSchedules } = require('../controllers/opdController');

// All OPD routes are protected in a full app, but for this demo I'll leave them open for now or add basic auth
router.post('/schedule', createSchedule);
router.get('/schedule', getAllSchedules);
router.post('/schedule/bulk-delete', deleteMultipleSchedules);
router.delete('/schedule/:id', deleteSchedule);

module.exports = router;
