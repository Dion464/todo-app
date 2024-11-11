import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from "/styles/profile.module.css"; 

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          router.push('/login'); // Redirect to login if no token
          return;
        }

        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogOut = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    router.push('/login'); // Redirect to login page
  };

  const handleBackToTasks = () => {
    router.push('/tasks'); // Navigate back to tasks page
  };

  if (loading) return <p>Loading...</p>;

  if (!userData) return <p>Error fetching user profile</p>;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileHeading}>User Profile</h1>
      <div className={styles.profileInfo}>
        
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Username:</strong> {userData.username}</p>
  
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleBackToTasks} className={styles.button}>Back to Tasks</button>
        <button onClick={handleLogOut} className={`${styles.button} ${styles.logoutButton}`}>Log Out</button>
      </div>
    </div>
  );
}
