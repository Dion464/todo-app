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

  const fetchTasks = async () => {
    try {
      let url = `/api/tasks?userId=${userId}`;
      if (filter === 'completed') url += `&completed=1`;
      else if (filter === 'incomplete') url += `&completed=0`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      // Sort tasks by createdAt in descending order
      const sortedTasks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const refetchTasks = () => {
    fetchTasks();
  };

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
      const newTaskData = await response.json();
      setTasks([newTaskData, ...tasks]); // Prepend the new task
      setNewTask('');
      setNewDescription('');
      setCategory('');
      setToastMessage(`Task titled "${newTask}" added successfully!`);
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const onCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Log tasks after state update
  useEffect(() => {
    console.log('Tasks updated:', tasks);
  }, [tasks]);

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
            placeholder="Add new task (max 20 characters)"
            className={styles.inputField}
            maxLength={MAX_TASK_LENGTH}
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Add a description (optional, max 40 characters)"
            className={styles.inputField}
            maxLength={MAX_DESCRIPTION_LENGTH}
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

        {toastMessage && (
          <div className={styles.toastMessage}>
            <p>{toastMessage}</p>
          </div>
        )}

        <div className={styles.taskList}>
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            filter={filter}
            refetchTasks={refetchTasks}
          />
        </div>

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