// server/routes/habitRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  markComplete,
} = require('../controllers/habitController');

// All these routes require the user to be logged in
router.post('/create', authMiddleware, createHabit);
router.get('/all', authMiddleware, getHabits);
router.put('/update', authMiddleware, updateHabit);
router.delete('/delete', authMiddleware, deleteHabit);
router.post('/mark-complete', authMiddleware, markComplete);

module.exports = router;
