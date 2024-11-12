import styles from "../styles/ login.module.css";
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
        console.error('Login error response:', errorResponse);
        return;
      }

      const { token } = await response.json(); 
      localStorage.setItem('token', token);
      router.push('/tasks');
    } catch (error) {
      console.error('Unexpected error during login:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Login</h1>
      <p className={styles.subheading}>Welcome back! Please login to your account.</p>

      <div className={styles.form}>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.inputField}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.inputField}
        />

        <button onClick={handleLogin} className={styles.button}>Login</button>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button 
          onClick={() => router.push('/signup')} 
          className={styles.redirectButton}
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}
