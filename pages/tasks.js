import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import styles from '../styles/task.module.css';
import CategoryModal from '../components/categorySelection';

export default function FilteredTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();
  const { filter } = router.query;
  const userId = 1;
  const MAX_TASK_LENGTH = 20;
  const MAX_DESCRIPTION_LENGTH = 40;

  // Fetch tasks
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

  useEffect(() => {
    fetchTasks();
  }, [filter]);

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
        body: JSON.stringify({ title: newTask, description: newDescription, userId, category }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      fetchTasks();
      setNewTask('');
      setNewDescription('');
      setToastMessage(`Task titled "${newTask}" added successfully!`);
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const onCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setToastMessage(`Category "${selectedCategory}" selected!`);
    setIsModalOpen(false);
  };

  // Hide toast message after 2 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 2000);  // Toast disappears after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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
            onChange={(e) => {
              if (e.target.value.length <= MAX_TASK_LENGTH) {
                setNewTask(e.target.value);
              }
            }}
            placeholder="Add new task (max 20 characters)"
            className={styles.inputField}
          />
          <input
            value={newDescription}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                setNewDescription(e.target.value);
              }
            }}
            placeholder="Add a description (optional, max 40 characters)"
            className={styles.inputField}
          />
          <button onClick={() => setIsModalOpen(true)} className={styles.categoryButton}>
            Select Category
          </button>
          <div className={styles.buttonContainer}>
            <button onClick={() => setNewTask('')} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={addTask} className={styles.addButton}>
              Add
            </button>
          </div>
        </div>

        {/* Display success message (Toast) */}
        {toastMessage && (
          <div className={styles.toastMessage}>
            <p>{toastMessage}</p>
          </div>
        )}

        {/* Task list */}
        <div className={styles.taskList}>
          <TaskList tasks={tasks} setTasks={setTasks} filter={filter} />
        </div>

        {/* Category Modal */}
        {isModalOpen && (
          <CategoryModal
            onClose={() => setIsModalOpen(false)}
            onSelectCategory={onCategorySelect}
          />
        )}
      </div>
    </div>
  );
}
