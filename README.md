# Todo App

A simple to-do app with user authentication, task management, and profile features. Users can sign up, log in, add tasks, view completed tasks, and manage their task list. This app uses Next.js for the frontend, SQLite for the database, and CSS Modules for styling.

## Made by:
**Dion Curri**

## Features:
- **User authentication**: (Sign up, Log in)
- **Profile page**: displaying users credentiales log out button and changing username features 
- **Tasks**: Add and manage tasks
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

### 4. To se the description flip the card also description is optional 

## Folder Structure:
```plaintext
todo-app/
├── components/                     # Reusable UI components
│   ├── Sidebar.js                  # Sidebar component
│   └── TaskList.js                 # Task list component
├── lib/                            # Utility libraries
│   ├── auth.js                     # Authentication utilities
│   └── db.js                       # Database connection setup
├── pages/                          # Next.js pages and API routes
│   ├── _app.js                     # Custom App component
│   ├── _document.js                # Custom Document component
│   ├── index.js                    # Main entry point
│   ├── login.js                    # Login page
│   ├── profile.js                  # Profile page
│   ├── signup.js                   # Signup page
│   ├── tasks.js                    # Tasks page
│   ├── api/                        # API routes
│   │   ├── auth/                   # Auth-related API endpoints
│   │   │   ├── login.js            # Login API route
│   │   │   ├── profile.js          # Profile API route
│   │   │   └── signup.js           # Signup API route
│   │   └── tasks/                  # Task-related API endpoints
│   │       ├── [filter].js         # Dynamic route for task filtering
│   │       └── index.js            # Default tasks API route
├── public/                         # Public assets
│   ├── images.jpeg                 # Logo image
│   └── images.png                  # Default profile image
├── styles/                         # CSS Modules and global styles
│   ├── globals.css                 # Global styles
│   ├── login.module.css            # Styles for login page
│   ├── Sidebar.module.css          # Styles for Sidebar component
│   ├── TaskList.module.css         # Styles for TaskList component
│   ├── home.module.css             # Styles for homepage
│   ├── profile.module.css          # Styles for profile page
│   ├── signup.module.css           # Styles for signup page
│   └── task.module.css             # Styles for tasks page
├── database.sqlite                 # SQLite database file
├── initDb.js                       # Script to initialize the SQLite database
├── jsconfig.json                   # JavaScript configuration
├── next.config.mjs                 # Next.js configuration
├── package.json                    # Project configuration
├── package-lock.json               # Dependency lock file
└── README.md                       # Project documentation
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
