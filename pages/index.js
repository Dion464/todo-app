
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Todo App</h1>
      <p>Please log in or sign up to manage your tasks.</p>
      <div>
        <Link href="/login" legacyBehavior>
          <a>Login</a>
        </Link>
        <br />
        <Link href="/signup" legacyBehavior>
          <a>Sign Up</a>
        </Link>
      </div>
      {isAuthenticated && (
        <div>
          <h2>Your Tasks</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map(task => (
                <li key={task.id}>
                  {task.title} {task.completed ? '(Completed)' : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
