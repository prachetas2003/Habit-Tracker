// client/src/components/StatsPieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatsPieChart({ completedCount, totalCount }) {
  // Calculate missed or not-completed count
  const missedCount = totalCount - completedCount;

  const data = {
    labels: ['Completed', 'Missed'],
    datasets: [
      {
        label: 'Habit Completion',
        data: [completedCount, missedCount],
        backgroundColor: ['#4caf50', '#ff7043'], // green & orange
        borderColor: ['#388e3c', '#e64a19'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="chart-container">
      <h3>Your Habit Success Rate</h3>
      <Pie data={data} options={options} />
    </div>
  );
}

export default StatsPieChart;
