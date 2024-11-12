import React from 'react';
import styles from '../styles/TaskList.module.css';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  return (
    <div className={styles.taskList}>
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskItem}>
          <span className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}>
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
              className={`${styles.taskButton} ${styles.deleteButton}`}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
