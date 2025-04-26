# Booking System
Welcome to the Booking System! This application is designed to manage hospital bookings, providing users the ability to browse hospitals, services, and schedule appointments.
## Table of Contents
1. [Project Structure](#project-structure)
2. [Features](#features)
3. [Setup and Running Locally](#setup-and-running-locally)
4. [Running with Docker](#running-with-docker)
5. [API Routes](#api-routes)
6. [Environment Variables](#environment-variables)
7. [Database and Seeding](#database-and-seeding)

## Project Structure
The project structure is as follows:
``` 
.
├── bin/                 # Contains the application entry point and server definition
├── data/                # Contains the SQLite database file
├── middleware/          # Custom middleware for the app
├── models/              # Data models (if any)
├── public/              # Static files (CSS, JS, images)
├── routes/              # Router definitions for pages, auth, and booking
├── seeders/             # Scripts for seeding the database
├── views/               # Pug templates for rendering HTML
├── .env                 # Environment variables
├── app.js               # Main Express app configuration
├── db.js                # Database configuration and connection
├── package.json         # Project metadata and dependencies
└── README.md            # Documentation
```
## Features
- User authentication (Signup/Login) using **JWT (JsonWebToken)**.
- Hospital management system with bookings linked to services.
- Rate limiting and CSRF protection baked into the application to handle attacks.
- Seamless integration of **SQLite** as the database.
- Middleware for error handling and user context.
- Modularized routers for authentication, booking, and pages.

## Setup and Running Locally
### Prerequisites
- **Node.js** (v16.x or higher recommended) and **npm** package manager.
- SQLite installed (if needed for checking the database manually).

### Steps
1. Clone the repository:
``` bash
    git clone <repository-url>
    cd booking-system
```
1. Install dependencies:
``` bash
    npm install
```
2. Create and configure environment variables:
    - Create a file in the root folder. `.env`
    - Add the required variables (see [Environment Variables](#environment-variables)).
3. Start the application:
``` bash
    npm start
```
4. Open the app using your browser at:
``` 
    http://localhost:3000
```
## Running with Docker
The application can also be run using Docker, which ensures uniform execution across environments.
### Steps:
1. Build the Docker image:
``` bash
    docker-compose up --build
```
2. Application will now be accessible at:
``` 
    http://localhost:3000
```
## API Routes
The application routes are grouped and categorized into functionality. Below are the primary endpoints:
### Authentication
- **POST `/auth/signup`** – User signup.
- **POST `/auth/login`** – User login.

### Bookings
- **GET `/booking/`** – Fetch active bookings for the logged-in user.
- **POST `/booking/`** – Create a new booking.
- **DELETE `/booking/:id`** – Cancel an existing booking.

### Pages
- **GET `/`** – Homepage listing hospitals and services.
- **GET `/hospitals/:id/services`** – Fetch services offered by a specific hospital.

## Environment Variables
The application uses a file for environment configuration. Below are the required keys: `.env`

| Key | Description | Example Value |
| --- | --- | --- |
| `PORT` | The port where the app will be served | `3000` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_jwt_secret_key` |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window duration in milliseconds | `900000` |
| `RATE_LIMIT_MAX` | Maximum requests allowed in the rate limit window | `100` |
## Database and Seeding
### Database
The application uses **SQLite** as the database. The database file is located in the `data/` directory with the filename . `hospital_booking.db`
Before running, ensure that the database is seeded using the following command:
``` bash
npm run seed
```
### Database Tables
The database includes the following tables:
1. **`users`**: Stores user credentials (`id`, `email`, `password`).
2. **`hospitals`**: Stores hospital details (`id`, `name`, `address`).
3. **`services`**: Stores services provided by hospitals (`id`, `hospital_id`, `name`).
4. **`bookings`**: Stores user bookings (`id`, `user_id`, , ). `service_id``appointment_date`

### Database Seeding
On the first run (or after clearing the database), seeders insert dummy data for hospitals, services, and bookings. Seeding is skipped if data already exists.
## Security Features
- **CSRF Protection**: Ensures secure form submissions using tokens.
- **Rate Limiting**: Limits request volume per IP to prevent DoS attacks.
- **Password Hashing**: User passwords are stored hashed using **bcrypt**.
- **Environment Isolation**: Sensitive keys are stored in environment variables.

## Additional Notes
- The view templates are created with **Pug** for dynamic rendering.
- **Nodemon** is used in development mode for auto-restart on file changes.
- Error handling middleware ensures consistent error output across the system.
