import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/profile.module.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // To store the success/error message
  const [messageColor, setMessageColor] = useState(''); // To store the color for the message
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        setUserData(data);
        setNewUsername(data.username);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleBackToTasks = () => {
    router.push('/tasks');
  };

  const handleUsernameChange = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData((prev) => ({ ...prev, username: newUsername }));
        setMessage('Username updated successfully');
        setMessageColor('green'); // Success message in green
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setMessageColor('red'); // Error message in red
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setMessage('Error updating username');
      setMessageColor('red'); // Error message in red
    }

    // Reset the message after 4 seconds
    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error fetching user profile</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <img src="/images.png" alt="Profile Avatar" className={styles.profileImage} />
          <div className={styles.profileDetails}>
            <h2 className={styles.username}>{userData.username}</h2>
            <p className={styles.email}>{userData.email}</p>
          </div>
        </div>

        <div className={styles.editSection}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className={styles.usernameInput}
            placeholder="Enter new username"
          />
          <button onClick={handleUsernameChange} className={`${styles.button} ${styles.saveButton}`}>
            Save Username
          </button>
        </div>

        {/* Display the success or error message */}
        {message && (
          <div className={styles.message} style={{ color: messageColor }}>
            {message}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <button onClick={handleBackToTasks} className={`${styles.button} ${styles.backButton}`}>
            Back to Tasks
          </button>
          <button onClick={handleLogOut} className={`${styles.button} ${styles.logoutButton}`}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
