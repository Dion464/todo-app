import React from 'react';
import styles from "../styles/footer.module.css";
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter

const profileImage = '/images.png'; 

const Footer = () => {
  const router = useRouter(); // Get current route

  // Check if the current route is one of the excluded pages (login, signup, or index)
  const excludedPages = ['/login', '/signup','/profile', '/'];

  // If we are on one of the excluded pages, don't render the profile link
  const showProfileLink = !excludedPages.includes(router.pathname);

  return (
    <footer className={styles.footer}>
      <div className={styles.profileSection}>
        {/* Conditionally render the profile link if the current route is not login, signup, or index */}
        {showProfileLink && (
          <Link href="/profile">
            <img src={profileImage} alt="Profile" className={styles.profileImage} />
          </Link>
        )}
      </div>
      <div className={styles.footerContent}>
        <p>&copy; 2024 To-Do App. All rights reserved.</p>
        {/* Mail to link */}
        <p>
          If any problem occurs while using the app, contact us: <a href="mailto:curridion31@gmail.com">curridion31@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
