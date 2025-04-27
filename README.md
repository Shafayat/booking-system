# Booking System

Welcome to the Booking System! This web application allows users to manage hospital bookings, browse hospitals and their services, and schedule appointments easily.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Running with Docker](#running-with-docker)
4. [API Endpoints](#api-endpoints)
5. [Environment Variables](#environment-variables)
6. [Database](#database)
7. [Security Features](#security-features)
8. [Additional Notes](#additional-notes)

---

## Features

- **User Authentication:** Signup and login via secure authentication using JSON Web Tokens (JWT).
- **Hospital Management:** Browse hospitals, their offered services, and schedule appointments.
- **Booking Management:** Create, view, and cancel your hospital appointments.
- **Security:** Includes CSRF protection, and password hashing.
- **Modular Routes:** Organized routers for authentication, booking, and viewing pages.
- **SQLite Database:** Robust SQLite data storage, accessed using Sequelize ORM.
- **Error Handling:** Centralized middleware for consistent error responses.
- **Dynamic Views:** Pages rendered with EJS and Bootstrap for responsive layout.

---

## Getting Started

### Prerequisites

- **Node.js** (v16.x or higher recommended)
- **npm** (comes with Node.js)
- (Optional) SQLite client for manual DB inspection

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shafayat/booking-system.git
   cd booking-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
    - Copy `.env.example` (if present) or create `.env` in the project root.
    - Add environment variables as shown below ([see Environment Variables](#environment-variables)).

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Access the application:**
   ```
   http://localhost:3000
   ```

---

## Running with Docker

You can run the application using Docker for consistency across environments.

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. Access the app at:
   ```
   http://localhost:3000
   ```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Authenticate and obtain a JWT.

### Bookings

- `GET /api/booking/mine` – Get all bookings for the logged-in user.
- `POST /api/booking/book` – Create a new booking.
- `DELETE /api/booking/:id/remove` – Cancel a specific booking.

### Hospitals/Services

- `GET /api/hospitals/list` – Get the hospital list.
- `GET /api/hospitals/:id/services` – List services for a selected hospital.

---

## Environment Variables

Create a file `.env` in the project root:

| Key                   | Description                                       | Example Value          |
|-----------------------|---------------------------------------------------|-----------------------|
| `PORT`                | Port number where the server will run             | `3000`                |
| `JWT_SECRET`          | Secret used to sign JWT tokens                    | `your_jwt_secret_key` |

---

## Database

- Uses **SQLite**; database file is located at `database.sqlite`.

**Core Tables:**

- `users` – User credentials
- `hospitals` – Hospital information
- `services` – Services each hospital provides
- `bookings` – User booking records

---

## Security Features

- **CSRF Protection:** Prevents cross-site request forgery.
- **Password Hashing:** All user passwords are securely hashed (bcrypt).
- **Environment Variables:** All secrets and sensitive values are externalized.

---

## Additional Notes

- **View Engine:** Uses EJS and integrates with Bootstrap for styling.
- **Development:** `nodemon` can be used for automatic server restarts.
- **Error Handling:** Centralized middleware for consistent, user-friendly errors.

---

