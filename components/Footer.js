import React from 'react';
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2024 To-Do App. All rights reserved.</p>
        {/* Mail to link */}
        <p>
          Contact us: <a href="mailto:curridion31@gmail.com">curridion31@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
