Products Management System

A complete MERN Stack Products Management System with authentication, CRUD operations, image upload, and a modern responsive UI.

 Live Demo

 Frontend Live Link: https://productr-jade.vercel.app/login
 Backend API Link: https://backend-e0xn.onrender.com/


 Features
 Authentication

Login using Email / Phone Number

OTP-based verification system

JWT-based authentication

Protected routes for secure access

Demo OTP Mode enabled (OTP shown on UI for easy testing)

 Product Management

Create new products

View all products in dashboard

Update product details

Delete products with confirmation modal

Upload product images

Publish / Unpublish product

Stock & Price management

 Tech Stack
    Backend
       Node.js
        Express.js

MongoDB (Mongoose)

JWT Authentication

Multer (File Uploads)

Frontend

React.js

React Router DOM

Axios

React Hot Toast

CSS3 (Custom styling)

 Demo OTP Mode (Important)

Since this project is made for assignment/demo purposes, OTP is not sent to email.

OTP is generated and displayed directly on UI (Demo Mode) for testing.

Example:

User enters email/phone

OTP is generated

OTP is displayed on OTP Verification screen

User enters OTP and logs in successfully

 
 Installation & Setup
 Prerequisites

Node.js (v14+ recommended)

MongoDB (Local or MongoDB Atlas)

Git

 Backend Setup

Go to backend folder:

cd backend


Install packages:

npm install


Create .env file inside backend folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Start backend server:

npm start


Backend runs on:
 http://localhost:5000

 Frontend Setup

Go to frontend folder:

cd frontend


Install packages:

npm install


Start frontend:

npm start


Frontend runs on:
http://localhost:3000

 Deployment
Frontend Deployment

You can deploy frontend using:

Vercel

Backend Deployment

You can deploy backend using:

Render
