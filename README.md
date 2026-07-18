# DRDO Internship Registration & Management Portal

A full-stack web application developed for **Defence Research and Development Organisation (DRDO)** to automate the complete internship process, including student registration, admin approval, offer letter generation, training management, Gyapan generation, and certificate generation.

---

# Features

## Student Module

- Student Registration
- Student Login using Email & Reference ID
- Unique Reference ID Generation
- Document Upload
- Registration Confirmation Email
- Download Offer Letter (Approved Students)
- View Application Status

---

## Admin Module

### Authentication

- Secure Admin Login
- JWT Authentication
- Protected Routes

### Student Management

- View All Students
- Search Students
- Filter Students
- Approve / Reject Students
- Delete Student Records

### Offer Letter Module

- Generate Offer Letter
- Preview Offer Letter
- Edit Offer Letter
- Upload Offer Letter
- Send Offer Letter by Email
- PDF Generation using Puppeteer

### Training Management System

- Course Management
- Branch Management
- Year Management
- Duration Management
- Guide Details
- Joining Status
- Completion Status

### Gyapan Module

- Select Multiple Students
- Preview Gyapan
- Generate Official Gyapan
- Download PDF
- Automatic Removal After Generation

### Certificate Module

- Date-wise Filtering
- Student Search
- Generate Certificates
- Individual PDF Download
- Automatic Removal After Generation

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- CSS

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Puppeteer
- Nodemailer
- Google OAuth2

---

# Project Structure

```
Web-Portal
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── scripts
│   ├── services
│   ├── templates
│   ├── uploads
│   ├── package.json
│   └── server.js
│
├── web-portal
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Requirements

Install the following before running the project.

- Git
- Node.js (v22 or above recommended)
- npm
- VS Code (Recommended)
- MongoDB Atlas Account
- Cloudinary Account
- Google Cloud Console Account (OAuth2)

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Web-Portal.git
```

Go inside the project

```bash
cd Web-Portal
```

---

# Backend Setup

Open terminal

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## Create .env File

Inside **backend** folder create

```
.env
```

Add:

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

EMAIL_USER=

MAIL_FROM=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REFRESH_TOKEN=
```

Replace all values with your own credentials.

---

## Install Puppeteer Browser

Run

```bash
npx puppeteer browsers install chrome
```

---

## Start Backend

```bash
npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal.

Go inside frontend

```bash
cd web-portal
```

Install dependencies

```bash
npm install
```

Run frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Running Complete Project

Open two terminals.

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd web-portal
npm install
npm run dev
```

Open browser

```
http://localhost:5173
```

---

# Build Production Version

Frontend

```bash
cd web-portal

npm run build
```

Backend

```bash
cd backend

npm start
```

---

# Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Storage

- Cloudinary

---

# Environment Variables

Backend

```
PORT
MONGODB_URI
JWT_SECRET
EMAIL_USER
MAIL_FROM
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

# Workflow

```
Student Registration
        │
        ▼
Upload Documents
        │
        ▼
Generate Reference ID
        │
        ▼
Admin Login
        │
        ▼
Approve / Reject Student
        │
        ▼
Generate Offer Letter
        │
        ▼
Training Management
        │
        ▼
Generate Gyapan
        │
        ▼
Generate Certificate
```

---

# Common Issues

## npm install error

Delete

```
node_modules
package-lock.json
```

Run

```bash
npm install
```

---

## Puppeteer Error

Run

```bash
npx puppeteer browsers install chrome
```

---

## MongoDB Connection Failed

Check

- MongoDB URI
- Network Access
- Database User Password

---

## Cloudinary Upload Failed

Verify

```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## Email Not Sending

Verify

```
EMAIL_USER
MAIL_FROM
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
```

Restart backend after editing `.env`.

---

# Screenshots

You can add screenshots here.

- Home Page
- Student Registration
- Student Login
- Admin Dashboard
- Offer Letter
- Training Management
- Gyapan
- Certificates

---

# Author

**Naina Kharola**

B.Tech Student

Graphic Era University

---

# Acknowledgement

This project was developed as part of an internship project for **Defence Research and Development Organisation (DRDO)** to automate the complete internship registration and management process.
