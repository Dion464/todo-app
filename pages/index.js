import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/home.module.css';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const fetchTasks = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch('/api/tasks');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTasks(data);
        } catch (error) {
          console.error('Error fetching tasks:', error); // Log fetch errors
        }
      }
    };

    fetchTasks();
  }, [isAuthenticated]);

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img src="/images.jpeg" alt="Logo" className={styles.logo} />
      </div>

      <h1 className={styles.heading}>Welcome to Todo App</h1>
      <p className={styles.subheading}>Please log in or sign up to manage your tasks.</p>

      <div className={styles.buttonContainer}>
        <Link href="/login" className={styles.button}>Login</Link>
        <Link href="/signup" className={styles.button}>Sign Up</Link>
      </div>

      {isAuthenticated && (
        <div className={styles.tasksSection}>
          <h2>Your Tasks</h2>
          {tasks.length > 0 ? (
            <ul className={styles.tasksList}>
              {tasks.map(task => (
                <li key={task.id} className={styles.taskItem}>
                  <span className={task.completed ? styles.completed : ''}>
                    {task.title}
                  </span>
                  {task.completed && <span>(Completed)</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noTasks}>No tasks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
