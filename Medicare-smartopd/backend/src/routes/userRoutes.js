const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers, getDoctors, getPatients, getStaff, updateUser, deleteUser, getDashboardStats } = require('../controllers/userController');

// Define API routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/dashboard/stats', getDashboardStats);
router.get('/doctors', getDoctors);
router.get('/patients', getPatients);
router.get('/staff', getStaff);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
