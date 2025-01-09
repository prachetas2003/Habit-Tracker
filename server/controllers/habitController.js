// server/controllers/habitController.js

const Habit = require('../models/Habit');

// Create a new habit
exports.createHabit = async (req, res) => {
  try {
    const { habitName, description } = req.body;

    if (!habitName) {
      return res.status(400).json({ error: 'Habit name is required.' });
    }

    // userId is set by auth middleware (we'll see that soon)
    const userId = req.user.userId;

    const newHabit = new Habit({
      userId,
      habitName,
      description,
    });

    await newHabit.save();

    res.status(201).json({ message: 'Habit created.', habit: newHabit });
  } catch (error) {
    console.error('Create Habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all habits for current user
exports.getHabits = async (req, res) => {
  try {
    const userId = req.user.userId;
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (error) {
    console.error('Get Habits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update habit name/description
exports.updateHabit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { habitId, habitName, description } = req.body;

    if (!habitId) {
      return res.status(400).json({ error: 'habitId is required.' });
    }

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: habitId, userId }, 
      { habitName, description },
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    res.json({ message: 'Habit updated.', habit: updatedHabit });
  } catch (error) {
    console.error('Update Habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { habitId } = req.body;

    if (!habitId) {
      return res.status(400).json({ error: 'habitId is required.' });
    }

    const deleted = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    res.json({ message: 'Habit deleted.' });
  } catch (error) {
    console.error('Delete Habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark habit as completed for a given date (or "toggle" it)
exports.markComplete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { habitId, date } = req.body; 
    // `date` can be provided by the frontend, or we can default to today

    if (!habitId) {
      return res.status(400).json({ error: 'habitId is required.' });
    }

    // Use today's date if not provided
    const dayToMark = date ? new Date(date) : new Date();
    dayToMark.setHours(0,0,0,0); // remove time part

    // Find habit
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found.' });
    }

    // Check if date is already marked => if so, remove it (toggle)
    const index = habit.completedDates.findIndex(
      (d) => d.toDateString() === dayToMark.toDateString()
    );
    
    if (index > -1) {
      // Already marked => remove it to unmark
      habit.completedDates.splice(index, 1);
    } else {
      // Not marked => add date
      habit.completedDates.push(dayToMark);
    }

    await habit.save();
    res.json({ message: 'Habit completion toggled.', habit });
  } catch (error) {
    console.error('Mark Complete error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
