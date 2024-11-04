// components/SubtaskList.js
import React from 'react';
import styles from '../styles/home.module.css';

const SubtaskList = ({ subtasks, onToggleComplete, onDelete }) => {
  if (!Array.isArray(subtasks)) {
    console.error('Expected subtasks to be an array, but got:', subtasks);
    return <div>No subtasks available</div>; // Optional: Display a message if subtasks are not an array
  }

  return (
    <div className={styles.subtaskList}>
      {subtasks.map(subtask => (
        <div key={subtask.id} className={styles.subtaskItem}>
          <span
            onClick={() => onToggleComplete(subtask.id)}
            className={subtask.completed ? styles.completed : ''}
          >
            {subtask.title}
          </span>
          <button onClick={() => onDelete(subtask.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default SubtaskList;
