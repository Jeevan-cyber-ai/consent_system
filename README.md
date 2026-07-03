# Consent System

A comprehensive web application designed to manage, track, and audit user consent for data processing. This system provides a robust solution for tracking user agreements, maintaining audit logs, handling notifications, and managing user profiles. 

## Features

- **Authentication & User Management**: Secure login and registration system with profile management.
- **Consent Tracking**: Granular tracking and management of user consent preferences (e.g., agreeing/revoking access to data processing).
- **Audit Logging**: Comprehensive logging of actions and consent changes, providing full transparency and traceability.
- **Data Subject Requests**: Handle requests related to personal data (e.g., viewing or managing user data).
- **Real-Time Notifications**: Instant updates via WebSockets for important events and changes in consent status.
- **Email Integration**: Automated email notifications using Nodemailer.

## Tech Stack

### Backend
- **Node.js** & **Express**: Web framework for building RESTful APIs.
- **MongoDB** & **Mongoose**: NoSQL database for flexible data modeling and schemas.
- **Socket.io**: Enabling real-time, bi-directional communication between web clients and servers.
- **JWT (JSON Web Tokens)**: Secure token-based authentication mechanism.
- **Bcrypt.js**: Password hashing for enhanced security.
- **Nodemailer**: Email sending functionality.
- **Multer**: File uploading middleware.
- **Helmet & Morgan**: Security and logging middleware.

### Frontend
- **React 19**: Modern UI library for building responsive and interactive user interfaces.
- **Vite**: Ultra-fast build tool and development server.
- **React Router v7**: Declarative routing for complex navigation flows.
- **Bootstrap 5**: CSS framework for responsive layout and styling.
- **Socket.io-client**: The client-side implementation of Socket.io.
- **Axios**: Promise-based HTTP client for the browser and node.js.
- **Lucide React**: Beautiful and consistent SVG icons.
- **React Leaflet**: React components for Leaflet maps.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or on a cloud provider like MongoDB Atlas.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository_url>
   cd consent_system
   ```

2. **Setup the Backend**:
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables (Backend)**:
   Create a `.env` file in the `backend` directory. Sample `.env` configuration:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   # Add other required environment variables for email, etc.
   ```

4. **Setup the Frontend**:
   Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   From the `backend` directory, run:
   ```bash
   npm start
   ```
   The backend will typically start on `http://localhost:5000`.

2. **Start the Frontend Development Server**:
   From the `frontend` directory, run:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:5173`.

## Folder Structure

```
consent_system/
├── backend/            # Express Node.js Server
│   ├── src/
│   │   ├── config/     # Configuration files (DB, etc.)
│   │   ├── controllers/# Route controllers
│   │   ├── middleware/ # Express middlewares (Auth, etc.)
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # Express API routes
│   │   ├── services/   # Business logic and external services
│   │   ├── sockets/    # Socket.io handlers
│   │   └── utils/      # Helper functions
│   └── server.js       # Entry point for backend
└── frontend/           # React SPA
    ├── src/
    │   ├── api/        # Axios API configurations
    │   ├── assets/     # Static assets like images
    │   ├── auth/       # Authentication context/components
    │   ├── components/ # Reusable React components
    │   ├── pages/      # Top-level page components
    │   ├── services/   # Client-side business logic
    │   ├── socket/     # Socket.io client setup
    │   └── styles/     # Custom CSS/styling
    └── App.jsx         # Root React component
```

## License

ISC License
