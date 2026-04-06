const { Feedback, User } = require('../models');

// @desc Create new feedback
// @route POST /api/feedback
// @access Private
exports.createFeedback = async (req, res) => {
    try {
        const { userId, name, email, role, subject, message, rating } = req.body;
        
        if (!userId || !message || !subject) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        const feedback = await Feedback.create({
            userId,
            name,
            email,
            role,
            subject,
            message,
            rating,
            status: 'pending'
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        console.error('Create feedback error:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// @desc Get all feedbacks (Admin only)
// @route GET /api/feedback
// @access Private/Admin
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email', 'role']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        console.error('Get feedbacks error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Update feedback status
// @route PUT /api/feedback/:id
// @access Private/Admin
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await Feedback.findByPk(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        feedback.status = status;
        await feedback.save();

        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        console.error('Update feedback error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Delete feedback
// @route DELETE /api/feedback/:id
// @access Private/Admin
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id);
        
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        await feedback.destroy();
        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('Delete feedback error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Delete multiple feedbacks
// @route DELETE /api/feedback
// @access Private/Admin
exports.deleteMultipleFeedbacks = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: 'No IDs provided' });
        }

        await Feedback.destroy({
            where: { id: ids }
        });

        res.status(200).json({ success: true, message: 'Feedbacks deleted successfully' });
    } catch (error) {
        console.error('Delete multiple feedbacks error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Delete all feedbacks
// @route DELETE /api/feedback/all
// @access Private/Admin
exports.deleteAllFeedbacks = async (req, res) => {
    try {
        await Feedback.destroy({ where: {}, truncate: true });
        res.status(200).json({ success: true, message: 'All feedbacks deleted successfully' });
    } catch (error) {
        console.error('Delete all feedbacks error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// @desc Get current user's feedback history
// @route GET /api/feedback/user/:userId
// @access Private
exports.getUserFeedbacks = async (req, res) => {
    try {
        const { userId } = req.params;
        const feedbacks = await Feedback.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        console.error('Get user feedbacks error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Delete selected feedbacks for a specific user
// @route DELETE /api/feedback/user/:userId/bulk
exports.deleteMultipleUserFeedbacks = async (req, res) => {
    try {
        const { userId } = req.params;
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, message: 'Invalid IDs' });
        }

        await Feedback.destroy({
            where: { 
                id: ids,
                userId: userId // Security check
            }
        });

        res.status(200).json({ success: true, message: 'Selected feedback history cleared' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// @desc Delete all feedbacks for a specific user
// @route DELETE /api/feedback/user/:userId/all
exports.deleteAllUserFeedbacks = async (req, res) => {
    try {
        const { userId } = req.params;
        await Feedback.destroy({
            where: { userId }
        });
        res.status(200).json({ success: true, message: 'Feedback history cleared successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
