import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h3>Task Filters</h3>
      <ul>
        <li><Link href="/tasks?filter=all">All Tasks</Link></li>
        <li><Link href="/tasks?filter=completed">Completed Tasks</Link></li>
        <li><Link href="/tasks?filter=incomplete">Incomplete Tasks</Link></li>
      </ul>
    </div>
  );
}
