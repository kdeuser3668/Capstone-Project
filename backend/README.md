#### Planner Backend

This project is the backend for the PlannerPal web app. It handles API requests, database operations, and authentication.

## Technologies:
Node.js
Express.js
MySQL2
dotenv
CORS
bcrypt
nodemon

Project Structure:
planner-backend/
│
├── db.js (Database connection setup)
├── server.js (Main entry point)
├── routes/
│ └── routes.js (Express routes for API endpoints)
├── models/ (Optional: database models)
├── .env (Environment variables file, not committed)
├── package.json (Dependencies and scripts)
└── README.txt (This file)

##### Setup Instructions:

## 1. Clone the repository
git clone https://github.com/kdeuser3668/Capstone-Project.git

cd backend

## 2. Install dependencies
npm install

## 3. Create a .env file in the root directory with the following:
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
PORT=3600

## 4. Run the server
For development (auto reload): npm run dev
For production: npm start

## 5. Database Connection:
The backend connects to MySQL using mysql2 in db.js.
Ensure that the .env file matches your AWS or Azure database credentials before running.