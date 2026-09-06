# Secure User Authentication System

A full-stack user authentication system built as part of the Prodigy InfoTech Full-Stack Web Development Internship.

The project implements secure user registration, password hashing, JWT-based authentication, protected routes, session handling, and a responsive authentication interface.

## Features

- User registration
- Input validation
- Email format validation
- Password confirmation
- Password hashing with bcrypt
- Duplicate email detection
- User login
- JWT-based authentication
- Protected profile route
- JWT expiration handling
- Automatic session expiry handling
- Logout functionality
- Password visibility toggle
- Responsive frontend
- MongoDB database integration
- Authentication error handling

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Tokens (JWT)
- dotenv
- CORS

## Authentication Flow

```text
User Registration
       ↓
Input Validation
       ↓
Password Hashing
       ↓
MongoDB
       ↓
User Login
       ↓
Password Verification
       ↓
JWT Generation
       ↓
Protected API Request
       ↓
JWT Verification
       ↓
Authenticated Profile