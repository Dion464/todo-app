// pages/profile.js
import React from 'react';
import Link from 'next/link';

export default function Profile() {
  // Dummy user data, replace with actual user fetching logic
  const user = {
    username: 'john_doe',
    email: 'john@example.com',
    completedTasks: ['Task 1', 'Task 2'], // Replace with actual fetched data
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <h2>Completed Tasks</h2>
      <ul>
        {user.completedTasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <Link href="/tasks">
        <a>Back to Tasks</a>
      </Link>
    </div>
  );
}
