import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreChart = ({ wins, losses, fetchStats }) => {
  const totalGames = wins + losses;

  const data = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        data: [wins, losses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const resetStats = async () => {
    try {
      await fetch('http://localhost:5000/api/stats/reset', {
        method: 'POST',
      });
      fetchStats(); // Refetch the updated stats
    } catch (error) {
      console.error('Error resetting stats:', error);
    }
  };

  return (
    <div style={{ width: 300, margin: 'auto', textAlign: 'center' }}>
      <h3>Win/Loss Chart</h3>
      {totalGames === 0 ? (
        <p>No games played yet!</p>
      ) : (
        <Pie data={data} />
      )}
      <button onClick={resetStats}>Reset Stats</button>
    </div>
  );
};

export default ScoreChart;
