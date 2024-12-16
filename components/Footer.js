import React from 'react';
import styles from "../styles/footer.module.css";
import Link from 'next/link';
const profileImage = '/images.png'; 
const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.profileSection}>
        <Link href="/profile">
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
        </Link>
      </div>
      <div className={styles.footerContent}>
        <p>&copy; 2024 To-Do App. All rights reserved.</p>
        {/* Mail to link */}
        <p>
          if any problem ocurres while  using the app contact us : <a href="mailto:curridion31@gmail.com">curridion31@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
