# Todo App

A simple to-do app with user authentication, task management, and profile features. Users can sign up, log in, add tasks, view completed tasks, and manage their task list. This app uses Next.js for the frontend, SQLite for the database, and CSS Modules for styling.

## Made by:
**Dion Curri**

## Features:
- User authentication (Sign up, Log in)
- Profile page displaying completed tasks and user credentials
- Add and manage tasks
- Display tasks specific to the logged-in user
- Responsive design

## Tech Stack:
- **Frontend**: Next.js, React
- **Backend**: Next.js API routes
- **Database**: SQLite3
- **Styling**: CSS Modules

---

## Setup Instructions

### 1. Install npm packages
Run the following command to install the required dependencies:

```
npm install
```

### 2. Initialize SQLite Database
Before running the application, initialize the SQLite database by running:

```
node initDB.js
```

This will create the `database.sqlite` file and the necessary tables.

### 3. Run the Application
To start the development server, run:

```
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Folder Structure:
```plaintext
todo-app/
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── profile.js  # API route for profile data
│   │   ├── index.js            # Main entry point
│   │   └── ...                 # Other page components
├── lib/
│  
├── styles/
│   ├── globals.css             # Global styles
│   └── Home.module.css         # Module-specific styles for the homepage
├── initDB.js                   # Script to initialize the SQLite database
├── package.json                # Project configuration
└── README.md                   # This file
└── database.sqlite         # SQLite database file
```

---

## Database Details:

The app uses an SQLite database with the following tables:

1. **users** - Stores user information.
2. **tasks** - Stores tasks, with a reference to the `users` table (`user_id`).
3. **subtasks** - Stores subtasks related to tasks.

To ensure each user can only view their tasks, the `tasks` table includes a `user_id` foreign key referencing the `users` table.

---

## Authentication Flow:
1. **Sign Up**: Users create an account by providing a username and password.
2. **Login**: Users log in with their username.

---

## Next Steps:
- Customize the design and layout further.
- Implement additional features like editing tasks, subtasks, or task deadlines.
