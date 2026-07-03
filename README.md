# Registration Web Portal

A professional full-stack Student Registration Web Portal developed using **React.js**, **Node.js**, and **Express.js**. The application allows students to register through a modern two-step form with document upload support. All submitted data is currently stored in **JSON format** for development purposes.

---

## Features

### Student Registration Form

- Two-step registration process
- Professional and responsive UI
- Progress indicator
- Client-side form validation
- Required field validation

### Personal Information

- Full Name
- Date of Birth
- Phone Number
- Email Address
- College Name
- Location
- Current Address
- Permanent Address
- Auto-fill Permanent Address using "Same as Current Address"

### Academic Information

- Dynamic Course Dropdown
- Dynamic Branch/Specialization Dropdown
- Dynamic Current Year Dropdown
- CGPA Validation
  - Students with **CGPA >= 7.5** can proceed to the next page.
  - Students with **CGPA < 7.5** cannot continue.

### Parent Information

- Father's Name
- Father's Contact Number
- Father's Occupation

### Document Upload

- Resume (PDF)
- Result (PDF / JPG / JPEG)
- Passport Size Photograph
- College Identity Card Number

### Backend Features

- REST API using Express.js
- File upload using Multer
- JSON-based data storage
- Automatic file organization
- Error handling
- CORS enabled

---

# Tech Stack

## Frontend

- React.js
- Vite
- JavaScript (ES6+)
- CSS3

## Backend

- Node.js
- Express.js
- Multer

## Storage

- JSON File
- Local File Storage

---

# Project Structure

```
Student-Registration-Web-Portal
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── uploads
│   │   ├── photos
│   │   ├── resumes
│   │   └── results
│   ├── data
│   │   └── students.json
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── web-portal
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── data
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/NainaKharola/Web-Portal.git
```

```bash
cd Web-Portal
```

---

# Frontend Setup

```bash
cd web-portal
```

Install dependencies

```bash
npm install
```

Run the frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Backend Setup

Open a new terminal

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Run backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# API Endpoint

## Submit Student Registration

```
POST /api/students
```

Stores:

- Student Details
- Resume
- Result
- Photograph

---

# Data Storage

Student information is currently stored in:

```
backend/data/students.json
```

Uploaded files are stored in:

```
backend/uploads/resumes/
backend/uploads/results/
backend/uploads/photos/
```

---

# Validation

✔ Required Fields

✔ Email Validation

✔ Phone Number Validation

✔ CGPA Validation

✔ File Type Validation

✔ Address Auto-fill

✔ Multi-step Navigation

---

# Future Improvements

- MongoDB Database Integration
- Student Login
- Admin Dashboard
- Search and Filter Students
- Edit Student Details
- Delete Student Records
- Authentication & Authorization
- Email Notifications
- Cloud File Storage
- Dashboard Analytics


---

# Author

**Naina Kharola**

GitHub: https://github.com/NainaKharola

---

# License

This project is developed for learning, academic, and demonstration purposes.