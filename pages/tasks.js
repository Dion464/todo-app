import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import styles from '../styles/task.module.css';
import Link from 'next/link';

export default function FilteredTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const router = useRouter();
  const { filter } = router.query;
  const userId = 1; // Placeholder user ID

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
      console.error('Error fetching tasks:', error);
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
    if (!newTask.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask, userId }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      fetchTasks();
      setNewTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion
  const onToggleComplete = async (taskId) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) throw new Error('Task not found');

      const updatedTask = { ...task, completed: !task.completed };

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'), // Authorization token
        },
        body: JSON.stringify({ completed: updatedTask.completed, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to toggle task completion');
      }

      fetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Delete task with error handling and token authorization
  const onDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // Authorization token
        },
      });

      if (!response.ok) throw new Error('Failed to delete task');
      fetchTasks(); // Re-fetch tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetInput = () => {
    setNewTask('');
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.mainContent}>
        <h2 className={styles.header}>
          {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks` : 'All Tasks'}
        </h2>

        <div className={styles.taskInputContainer}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task"
            className={styles.taskInput}
          />
          <button onClick={resetInput} className={styles.deleteButton}>
            Cancel
          </button>
          <button onClick={addTask} className={styles.addButton}>
            Add
          </button>
        </div>

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
