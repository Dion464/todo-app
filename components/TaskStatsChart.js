import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import styles from "../styles/TaskStatsChart.module.css";

// Registering required chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const TaskStatsChart = ({ stats }) => {
  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        label: 'Tasks',
        data: [stats.completed, stats.total - stats.completed],
        backgroundColor: ['#4caf50', '#f44336'],
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Task Completion Stats',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartCard}>
        <h3>Task Completion Stats</h3>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskStatsChart;