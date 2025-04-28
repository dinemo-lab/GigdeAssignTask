# Task Tracker Application

A full-stack task management application where users can track project progress. Built with React, Redux, Node.js, Express, and MongoDB.

## Features

- User Authentication (Signup, Login)
- Project Management (up to 4 projects per user)
- Task Management (Create, Read, Update, Delete)
- Task Status Tracking (Todo, In Progress, Completed)
- Responsive UI using Tailwind CSS
- JWT Authentication

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- ES Module imports

## Installation and Setup

### Prerequisites
- Node.js (v16+)
- MongoDB

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/task-tracker.git
cd task-tracker
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the backend server
```bash
npm run dev
```

The backend server will start running on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory
```bash
cd frontend
```

2. Install frontend dependencies
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory with:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend development server
```bash
npm run dev
```

The frontend application will be available at http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (Protected)

### Projects
- `POST /api/projects` - Create a new project (Protected)
- `GET /api/projects` - Get all projects for the logged in user (Protected)
- `GET /api/projects/:id` - Get a single project by ID (Protected)
- `PUT /api/projects/:id` - Update a project (Protected)
- `DELETE /api/projects/:id` - Delete a project (Protected)

### Tasks
- `POST /api/projects/:id/tasks` - Create a new task in a project (Protected)
- `GET /api/projects/:id/tasks` - Get all tasks for a project (Protected)
- `PUT /api/projects/:id/tasks/:taskId` - Update a task (Protected)
- `DELETE /api/projects/:id/tasks/:taskId` - Delete a task (Protected)

## Deployment

The application can be deployed to various platforms:

### Backend
- Heroku
- Render
- Digital Ocean
- AWS

### Frontend
- Vercel
- Netlify
- GitHub Pages

## Project Structure

```
task-tracker/
├── backend/                # Express server
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Server entry point
│
├── frontend/               # React client
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env.local          # Environment variables
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project documentation
```

## License

MIT
