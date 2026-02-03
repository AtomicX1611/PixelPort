# Places Sharing Application

Full-stack web app for creating, sharing, and exploring places with images and map locations.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Features

- User authentication with JWT and secure password hashing
- Create, edit, delete, and browse places with images and addresses
- Map-ready locations for each place
- Responsive, animated UI built with modern React tooling

## Tech Stack

### Backend
- Node.js and Express for the REST API
- MongoDB with Mongoose for data modeling
- jsonwebtoken for authentication
- bcryptjs for password hashing
- Multer for file uploads
- CORS and dotenv for cross-origin support and configuration

### Frontend
- React 19 with React Router for routing
- Bootstrap 5 and Tailwind CSS for styling
- React Google Maps API for maps
- Framer Motion, GSAP, and AOS for animations

## Installation

### 1. Get the code

```bash
cd react_app
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Configuration

### Backend

Create `backend/.env` with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
```

### Frontend

If needed, add `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

## Running the Application

### Development

Start backend (nodemon):

```bash
cd backend
npm run dev
```

Start frontend (hot reload):

```bash
cd frontend
npm run dev
```

### Production

Build frontend:

```bash
cd frontend
npm run build
```

Start backend:

```bash
cd backend
npm start
```
