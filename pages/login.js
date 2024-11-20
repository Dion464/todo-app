import styles from "../styles/ login.module.css";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.message || 'Login failed');
        return;
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);
      router.push('/tasks');
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <p className={styles.subheading}>Welcome back! Please login to your account.</p>

      <div className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.inputField}
          onKeyDown={handleKeyPress}
        />
        <div className={styles.passwordContainer}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
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

        <button onClick={handleLogin} className={styles.button}>
          Login
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button onClick={() => router.push('/signup')} className={styles.buttonSecondary}>
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}
