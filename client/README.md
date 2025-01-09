# Habit Tracker
A full-stack web application that helps users create, track, and maintain their daily habits. Users can register, log in, and mark each habit as complete or incomplete, with an at-a-glance pie chart visualization of their success rate.

## Features
JWT-Based Authentication: Secure registration and login with token-based session handling.
Custom Habit Management: Create, edit, and delete habits; mark them as completed for any given day.
Real-Time Tracking: A responsive dashboard showing daily status, plus a Chart.js pie chart visualizing overall success.
Attractive UI: Rounded-corner design, cohesive color palette, and intuitive layout built with React.
## Tech Stack
- Frontend: React, React Router, Chart.js
- Backend: Node.js, Express.js
Database: MongoDB (via Mongoose)
- Styling: Custom CSS with color variables and responsive design
## Getting Started

## Clone This Repo:

git clone https://github.com/YourUsername/habit-tracker.git  
cd habit-tracker 

### Set Up the Server:

cd server  
npm install  
### Create a .env file in the server folder (if not already):

MONGO_URI=mongodb://127.0.0.1:27017/habit_tracker  
PORT=5000  
JWT_SECRET=YourSecretKey

### Start the server:

npm run dev  
Set Up the Client:  
cd ../client  
npm install  
npm start  
### This opens the React app at http://localhost:3000 in your browser (or http://localhost:3002 if you’ve changed the default port).
## Usage
- Register with a username, email, and password.
- Log In to access your personal dashboard.
- Create Habits with optional descriptions.
- Mark Habits as completed for each day; the pie chart updates automatically to reflect your success rate.
- Edit or Delete any habit as needed.
- Log Out to end your session.
