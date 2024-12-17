import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/profile.module.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal state for logout confirmation
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
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setMessage('Error updating username');
    }

    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>Error fetching user profile</p>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profileImageWrapper}>
            <img src="/images.png" alt="Profile Avatar" className={styles.profileImage} />
          </div>
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
          <button onClick={handleUsernameChange} className={styles.saveButton}>
            Save Username
          </button>
        </div>

        {message && <div className={styles.message}>{message}</div>}

        <div className={styles.buttonContainer}>
          <button onClick={handleBackToTasks} className={styles.backButton}>
            Back to Tasks
          </button>
          <button onClick={handleShowModal} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Are you sure you want to log out?</h3>
            <div className={styles.modalActions}>
              <button onClick={handleLogOut} className={styles.modalConfirmButton}>
                Yes, Log Out
              </button>
              <button onClick={handleCloseModal} className={styles.modalCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
