import styles from "../styles/home.module.css"
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
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <li className={styles.login}>
      <input
      
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
/>

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      </li>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
