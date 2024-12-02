// components/Sidebar.js
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css';

const profileImage = '/images.png'; 

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Logo" className={styles.sidebarLogo} />
      </div>
      <h3>TODO-APP</h3>

      <div className={styles.profileSection}>
        <Link href="/profile">
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
        </Link>
      </div>

      <ul>
        <li><Link href="/tasks?filter=all">All Tasks</Link></li>
        <li><Link href="/tasks?filter=completed">Completed Tasks</Link></li>
        <li><Link href="/tasks?filter=incomplete">Incomplete Tasks</Link></li>
        <li><Link href="/dashbord">Dashboard</Link></li> {/* New Link */}
      </ul>
    </div>
  );
}
