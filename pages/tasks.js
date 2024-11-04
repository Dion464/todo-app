// pages/tasks.js
import React, { useEffect, useState } from 'react';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched tasks:', data); // Log fetched tasks
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return; // Prevent adding empty tasks
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      await fetchTasks(); // Refresh tasks after adding
      setNewTask(''); // Clear the input field
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return; // Ensure task exists
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !taskToToggle.completed }),
      });
      if (!response.ok) throw new Error('Failed to toggle task');
      await fetchTasks(); // Refresh tasks after toggling
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      await fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onFilterChange={() => {}} />
      <div style={{ marginLeft: '20px' }}>
        <h2>Tasks</h2>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTask}>Add Task</button>
        <TaskList 
          tasks={tasks} 
          onToggleComplete={toggleComplete} 
          onDelete={deleteTask} 
        />
        <Link href="/profile" style={{ marginTop: '20px', display: 'block' }}>
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
