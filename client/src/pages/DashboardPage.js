// client/src/pages/DashboardPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import StatsPieChart from '../components/StatsPieChart'; // <-- Suppose we want to add this

function DashboardPage() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Keep the state for habits, newHabit form, and any error messages
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ habitName: '', description: '' });
  const [error, setError] = useState('');

  // For the chart: track total vs completed (example)
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchHabits();
    }
    // eslint-disable-next-line
  }, [token]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/habits/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedHabits = res.data.habits;
      setHabits(fetchedHabits);

      // Example: simple “how many are completed today”
      let total = 0;
      let completed = 0;
      const today = new Date().toDateString();

      fetchedHabits.forEach((habit) => {
        total++;
        const isCompletedToday = habit.completedDates.some(
          (date) => new Date(date).toDateString() === today
        );
        if (isCompletedToday) {
          completed++;
        }
      });

      setTotalCount(total);
      setCompletedCount(completed);

    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newHabit.habitName.trim()) {
      setError('Habit name is required.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/habits/create', newHabit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewHabit({ habitName: '', description: '' });
      fetchHabits();
    } catch (err) {
      console.error(err);
      setError('Failed to create habit.');
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await axios.delete('http://localhost:5000/api/habits/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { habitId }
      });
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCompletion = async (habitId) => {
    try {
      await axios.post('http://localhost:5000/api/habits/mark-complete', { habitId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Welcome, {user?.username}!</h2>
      <button className="btn" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </button>

      {/* CREATE HABIT FORM */}
      <div className="card">
        <h3>Create New Habit</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleCreateHabit}>
          <input
            className="input-field"
            type="text"
            placeholder="Habit Name"
            value={newHabit.habitName}
            onChange={(e) => setNewHabit({ ...newHabit, habitName: e.target.value })}
          />
          <input
            className="input-field"
            type="text"
            placeholder="Description (optional)"
            value={newHabit.description}
            onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
          />
          <button className="btn" type="submit">
            Add Habit
          </button>
        </form>
      </div>

      {/* LIST EXISTING HABITS */}
      <h3>Your Habits</h3>
      {habits.map((habit) => {
        const today = new Date().toDateString();
        const isCompletedToday = habit.completedDates.some(
          (date) => new Date(date).toDateString() === today
        );

        return (
          <div key={habit._id} className="card">
            <h4>{habit.habitName}</h4>
            {habit.description && <p>{habit.description}</p>}

            <p>
              Status today: <strong>{isCompletedToday ? 'Completed' : 'Not Completed'}</strong>
            </p>
            <button className="btn" onClick={() => handleToggleCompletion(habit._id)}>
              {isCompletedToday ? 'Unmark' : 'Mark'} Today
            </button>
            &nbsp;
            <button
              className="btn"
              style={{ backgroundColor: 'red' }}
              onClick={() => handleDeleteHabit(habit._id)}
            >
              Delete
            </button>
          </div>
        );
      })}

      {/* CHART EXAMPLE  */}
      <StatsPieChart 
        completedCount={completedCount}
        totalCount={totalCount}
      />
    </div>
  );
}

export default DashboardPage;
