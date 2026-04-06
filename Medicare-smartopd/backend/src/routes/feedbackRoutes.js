const express = require('express');
const router = express.Router();
const {
    createFeedback,
    getAllFeedbacks,
    updateFeedbackStatus,
    deleteFeedback,
    deleteMultipleFeedbacks,
    deleteAllFeedbacks,
    getUserFeedbacks,
    deleteMultipleUserFeedbacks,
    deleteAllUserFeedbacks
} = require('../controllers/feedbackController');

// User operations
router.post('/', createFeedback);
router.get('/user/:userId', getUserFeedbacks);
router.delete('/user/:userId/all', deleteAllUserFeedbacks);
router.delete('/user/:userId/bulk', deleteMultipleUserFeedbacks);

// Admin operations
router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedbackStatus);
router.delete('/all', deleteAllFeedbacks);
router.delete('/:id', deleteFeedback);
router.delete('/', deleteMultipleFeedbacks);

module.exports = router;
