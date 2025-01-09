// server/models/Habit.js

const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  habitName: {
    type: String,
    required: true,
  },
  description: String,
  // We can store daily records or simply track completion dates
  // For example, let's store an array of dates that the user completed the habit
  completedDates: {
    type: [Date],
    default: [],
  },
}, { timestamps: true });

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;
