import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import styles from '../styles/task.module.css';
import Link from 'next/link';

export default function FilteredTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const router = useRouter();
  const { filter } = router.query;
  const userId = 1; // Placeholder user ID
  const MAX_TASK_LENGTH = 100; // Maximum characters for a task
  const MAX_DESCRIPTION_LENGTH = 30; // Maximum characters for description

  // Fetch tasks with the appropriate filter
  const fetchTasks = async () => {
    try {
      let url = `/api/tasks?userId=${userId}`;
      if (filter === 'completed') url += `&completed=1`;
      else if (filter === 'incomplete') url += `&completed=0`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  // Fetch tasks when the filter changes
  useEffect(() => {
    if (filter) {
      fetchTasks();
    }
  }, [filter]);

  // Add new task
  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Task cannot be empty!');
      return;
    }
    if (newTask.length > MAX_TASK_LENGTH) {
      alert(`Task cannot exceed ${MAX_TASK_LENGTH} characters.`);
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, description: newDescription, userId }), // Add description
      });
      if (!response.ok) throw new Error('Failed to add task');
      fetchTasks();
      setNewTask('');
      setNewDescription('');
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  // Toggle task completion
  const onToggleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing.');
        throw new Error('Authorization required.');
      }

      const task = tasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const updatedTask = { ...task, completed: !task.completed };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedTask.completed, userId }),
      });

      if (!response.ok) {
        console.error('Failed to toggle task completion:', await response.text());
        throw new Error('Failed to toggle task completion');
      }

      fetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error.message);
    }
  };

  // Delete task with error handling and token authorization
  const onDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Authorization token is missing.');
        throw new Error('Authorization required.');
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to delete task:', await response.text());
        throw new Error('Failed to delete task');
      }

      fetchTasks(); // Re-fetch tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const resetInput = () => {
    setNewTask('');
    setNewDescription('');
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainContent}>
        <h2 className={styles.header}>
          {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks` : 'All Tasks'}
        </h2>

        {/* Task input form */}
        <div className={styles.taskInputContainer}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => {
              if (e.target.value.length <= MAX_TASK_LENGTH) {
                setNewTask(e.target.value);
              }
            }}
            placeholder="Add new task (max 100 characters)"
            className={styles.inputField}
          />
          <textarea
            value={newDescription}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                setNewDescription(e.target.value);
              }
            }}
            placeholder="Add a description (optional, max 30 characters)"
            className={styles.inputField}
          />
          <div className={styles.buttonContainer}>
            <button onClick={resetInput} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={addTask} className={styles.addButton}>
              Add
            </button>
          </div>
        </div>

        {/* Display remaining character count */}
        <p className={styles.charCount}>
          {MAX_TASK_LENGTH - newTask.length} characters remaining for task title
        </p>
        <p className={styles.charCount}>
          {MAX_DESCRIPTION_LENGTH - newDescription.length} characters remaining for description
        </p>

        {/* Task list */}
        <div className={styles.taskList}>
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete} // Pass onDelete function
          />
        </div>

        <Link href="/profile" className={styles.profileLink}>
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
