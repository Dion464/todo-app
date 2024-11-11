import React from 'react';
import styles from '../styles/TaskList.module.css'; // Import styles

const TaskList = ({ tasks, onToggleComplete, onDelete, onUndo }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className={styles.taskItem}>
          <span
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              fontSize: '18px',
            }}
          >
            {task.title}
          </span>

          <div className={styles.taskActions}>
            {/* Complete/Undo Button */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className={styles.taskButton}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>

            {/* Delete Button */}
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
