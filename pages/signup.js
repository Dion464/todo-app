import styles from "../styles/signup.module.css";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Reset success message on form submit

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setSuccessMessage('Sign-up successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login'); // Redirect to login page after 2 seconds
      }, 2000);
    } else {
      const errorData = await response.json(); // Add 'await' to resolve the promise
      setError(errorData.message || 'An error occurred');
      console.error('Sign-up error:', errorData);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign Up</h1>
      <p className={styles.subheading}>Create your account to get started!</p>

      <div className={styles.form}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
          required
        />

        <button type="submit" onClick={handleSubmit} className={styles.button}>
          Sign Up
        </button>

        <button 
          onClick={() => router.push('/login')} 
          className={styles.redirectButton}
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
}
