const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUsers, 
    getUser, 
    getDoctors, 
    getPatients, 
    getStaff, 
    updateUser, 
    deleteUser, 
    getDashboardStats,
    deleteMultipleUsers,
    deleteAllUsers,
    seedSystemData,
    getUserSettings,
    updateUserSettings,
    getUserProfile,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Define API routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);
router.post('/dashboard/seed', seedSystemData);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id/settings', getUserSettings);
router.put('/:id/settings', updateUserSettings);
router.delete('/bulk', deleteMultipleUsers);
router.delete('/clear-all', deleteAllUsers);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);
router.get('/staff', getStaff);
router.get('/:id', getUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
