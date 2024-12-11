import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskStatsChart from '../components/TaskStatsChart';
import styles from "../styles/dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/tasks/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch task stats');
        }
        const data = await response.json();
        setStats(data);  // Set stats data here
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <h1>Welcome to Your Dashboard</h1>
          <p>Your task progress and stats</p>
        </div>
        <div className={styles.statsSummary}>
          <div className={styles.statCard}>
            <h3>Total</h3>
            <p>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Incomplete</h3>
            <p>{stats.total - stats.completed}</p>
          </div>
        </div>
        
        {/* Task Completion Stats Chart */}
        <TaskStatsChart stats={stats} />

        <div className={styles.backButton}>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
