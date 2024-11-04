// components/Sidebar.js
import React from 'react';
import styles from '../styles/Sidebar.module.css';

const Sidebar = ({ onFilterChange }) => {
  return (
    <div className={styles.sidebar}>
      <h2>Task Filters</h2>
      <ul>
        <li onClick={() => onFilterChange('all')}>All Tasks</li>
        <li onClick={() => onFilterChange('completed')}>Completed</li>
      </ul>
    </div>
  );
};

export default Sidebar;
