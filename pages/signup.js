import styles from "../styles/signup.module.css";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setSuccessMessage('');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      setSuccessMessage('Sign-up successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'An error occurred');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
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
          onKeyDown={handleKeyPress}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
          onKeyDown={handleKeyPress}
        />
        <div className={styles.passwordContainer}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
            onKeyDown={handleKeyPress}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" onClick={handleSubmit} className={styles.button}>
          Sign Up
        </button>

        <button onClick={() => router.push('/login')} className={styles.buttonSecondary}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
