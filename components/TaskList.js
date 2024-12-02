import React, { useState } from 'react';
import styles from '../styles/TaskList.module.css';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (taskId) => {
    setFlippedCards((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const isAnyCardFlipped = Object.values(flippedCards).some((flipped) => flipped);

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
    </div>
  );
};

export default TaskList;
