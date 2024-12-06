import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import styles from "../styles/TaskStatsChart.module.css"

// Registering chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const TaskStatsChart = ({ stats }) => {
  // Blue gradient background colors for each segment
  const gradientCompleted = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#1e3a5f'); // Dark blue
    gradient.addColorStop(1, '#64b5f6'); // Light blue
    return gradient;
  };

  const gradientIncomplete = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#90caf9'); // Soft blue
    gradient.addColorStop(1, '#42a5f5'); // Standard blue
    return gradient;
  };

  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [stats.completed, stats.total - stats.completed],
        backgroundColor: [
          gradientCompleted,
          gradientIncomplete
        ],
        hoverBackgroundColor: ['#1565c0', '#1976d2'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Task Completion Stats',
        font: {
          size: 20,
        },
        color: '#1e3a5f', // Dark blue for the title
      },
      tooltip: {
        backgroundColor: '#212121',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1e3a5f',
        borderWidth: 2,
      },
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      duration: 1500, // Smooth animation duration
    },
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartCard}>
        <h3>Task Completion Stats</h3>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TaskStatsChart;
