# Products Management System

A complete MERN stack application for product management with authentication, CRUD operations, and modern UI design.

## Features

### Authentication
- Email/Phone number login with OTP verification
- JWT-based authentication
- Secure session management

### Product Management
- Create, read, update, delete products
- Image upload and management
- Publish/Unpublish products
- Product categorization
- Stock management
- Price management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Nodemailer for OTP emails

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- CSS3 with custom design system

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/products_db
JWT_SECRET=your_jwt_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start MongoDB service (if using local MongoDB)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Configuration

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: Gmail address for sending OTP emails
- `EMAIL_PASS`: Gmail app password for authentication

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Header.js
│   │   │   ├── ProductCard.js
│   │   │   ├── ProductModal.js
│   │   │   └── DeleteConfirmModal.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── OTPVerification.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Home.js
│   │   │   └── Products.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```


This project is licensed under the MIT License.
