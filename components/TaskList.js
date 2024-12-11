import React, { useState } from 'react';
import styles from '../styles/TaskList.module.css';
import CategoryModal from './categorySelection';
import { FaBriefcase, FaHome, FaShoppingCart, FaRegHandshake, FaPlane, FaMoneyBillWave, FaTv } from 'react-icons/fa';

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

const TaskList = ({ tasks, onToggleComplete, onDelete, onAddTask }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const toggleFlip = (taskId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleAddTask = (newTask) => {
    onAddTask(newTask);
    setIsModalOpen(false);
  };

  const isAnyCardFlipped = Object.values(flippedCards).some((flipped) => flipped);

  const getCategoryIcon = (categoryName) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return category ? category.icon : null;
  };

  return (
    <div className={styles.taskList}>
      {isAnyCardFlipped && <div className={styles.backdrop}></div>}
      {tasks.map((task) => (
        <div key={task.id} className={styles.flipCard}>
          <div
            className={`${styles.flipCardInner} ${
              flippedCards[task.id] ? styles.flipped : ''
            }`}
          >
            <div className={styles.flipCardFront}>
              <span
                className={`${styles.taskTitle} ${
                  task.completed ? styles.completed : ''
                }`}
              >
                {task.title}
              </span>
              <div className={styles.taskCategory}>
                {/* Show category icon and name only once */}
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
                  className={styles.taskButton}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className={styles.taskButton}
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleFlip(task.id)}
                  className={styles.taskButton}
                >
                  Flip
                </button>
              </div>
            </div>
            <div className={styles.flipCardBack}>
              <p>{task.description || 'No description available'}</p>
              <button
                onClick={() => toggleFlip(task.id)}
                className={`${styles.taskButton} ${styles.flipBackButton}`}
              >
                Flip Back
              </button>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <CategoryModal
          task={currentTask}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
};

export default TaskList;
