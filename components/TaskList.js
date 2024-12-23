import React, { useState } from 'react';
import styles from '../styles/TaskList.module.css';
import { FaBriefcase, FaHome, FaShoppingCart, FaPlane, FaMoneyBillWave, FaTv } from 'react-icons/fa';

const categories = [
  { name: 'Work', icon: <FaBriefcase /> },
  { name: 'Personal', icon: <FaHome /> },
  { name: 'Urgent', icon: '⚡' },
  { name: 'Shopping', icon: <FaShoppingCart /> },
  { name: 'Health', icon: '💪' },
  { name: 'Study', icon: '📚' },
  { name: 'Travel', icon: <FaPlane /> },
  { name: 'Family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Finance', icon: <FaMoneyBillWave /> },
  { name: 'Entertainment', icon: <FaTv /> },
];

const TaskList = ({ tasks, setTasks, refetchTasks }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const toggleFlip = (taskId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  const onToggleComplete = async (taskId) => {
    try {
      const taskIndex = tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return;

      const taskToUpdate = tasks[taskIndex];

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !taskToUpdate.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex].completed = !taskToUpdate.completed;
      setTasks(updatedTasks);
      refetchTasks();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const onDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openDeleteModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className={styles.taskList}>
      {tasks.map((task) => (
        <div key={task.id} className={styles.flipCard}>
          <div
            className={`${styles.flipCardInner} ${flippedCards[task.id] ? styles.flipped : ''}`}
          >
            <div className={styles.flipCardFront}>
              <span
                className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}
              >
                {task.title}
              </span>
              <div className={styles.taskCategory}>
                {task.category && (
                  <>
                    <span className={styles.categoryIcon}>{getCategoryIcon(task.category)}</span>
                    <span>{task.category}</span>
                  </>
                )}
              </div>
              <div className={styles.taskActions}>
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`${styles.taskButton} ${task.completed ? styles.completedButton : ''}`}
                >
                  {task.completed ? 'Undo ⏭️' : 'Complete 🤘'}
                </button>
                <button
                  onClick={() => openDeleteModal(task)}
                  className={styles.taskButton}
                >
                  Delete 🗑️
                </button>
                <button
                  onClick={() => toggleFlip(task.id)}
                  className={styles.taskButton}
                >
                  Flip →
                </button>
              </div>
            </div>
            <div className={styles.flipCardBack}>
              <p>{task.description || 'No description available'}</p>
              <button
                onClick={() => toggleFlip(task.id)}
                className={`${styles.taskButton} ${styles.flipBackButton}`}
              >
                Flip Back 🔙
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && currentTask && (
        <div className={styles.confirmationModal}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to delete this task?</h3>
            <div className={styles.modalActions}>
              <button onClick={closeModal} className={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(currentTask.id);
                  closeModal();
                }}
                className={styles.confirmButton}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;