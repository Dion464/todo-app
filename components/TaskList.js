// components/TaskList.js
import React from 'react';

const TaskList = ({ tasks, onToggleComplete, onDelete }) => {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title}
          </span>
          <button onClick={() => onToggleComplete(task.id)}>
            {task.completed ? 'Undo' : 'Complete'}
          </button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
