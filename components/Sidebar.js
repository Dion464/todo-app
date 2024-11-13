import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" className={styles.sidebarLogo} />
      </div>
      <h3>Task Filters</h3>
      <ul>
        <li><Link href="/tasks?filter=all">All Tasks</Link></li>
        <li><Link href="/tasks?filter=completed">Completed Tasks</Link></li>
        <li><Link href="/tasks?filter=incomplete">Incomplete Tasks</Link></li>
      </ul>
    </div>
  );
}
