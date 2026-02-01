# Job Tracker Application 📋

A full-stack **Job Application Tracking System** that helps users manage and track their job search efficiently — all in one place.

This project was built with a strong focus on **real-world workflows, clean architecture, and user experience**, not just basic CRUD operations.

Built with care, continuous iteration, and learning ❤️

---

## 🚀 Live Demo

- **Frontend**:(https://job-tracker-app-kappa.vercel.app)
- **Backend API**:  https://job-tracker-production-38c5.up.railway.app  

---

## 🧩 Tech Stack

### Frontend
- React
- Bootstrap
- Axios
- JWT Authentication

### Backend
- Spring Boot
- Spring Security
- JWT (Authentication & Authorization)
- JPA / Hibernate
- MySQL (Railway)

### Deployment
- Frontend: Vercel
- Backend & Database: Railway

---

## ✨ Features

- User authentication (Register / Login)
- Secure JWT-based API access
- Add job applications with:
  - Company name
  - Job title
  - Job link
  - Job type (Remote / Onsite / Hybrid)
  - Application source
  - Application mode
  - Notes
- Track application status:
  - Applied
  - Interview
  - Offer
  - Rejected
  - Joined
- Dashboard summary with statistics
- Update job status directly from dashboard
- Delete applications
- Proper user-facing error handling
- Responsive and clean UI

---

## 📊 Dashboard Overview

The dashboard provides a quick snapshot of your job search:

- Total applications
- Applied
- Interviews
- Offers
- Rejected

This allows users to understand their progress at a glance.

---

## 🔐 Authentication Flow

1. User logs in or registers
2. Backend generates a JWT token
3. Token is stored on the client
4. Token is sent with every protected API request
5. Backend validates token before processing requests

---

## 🛠️ How to Run Locally

### Frontend

``bash
git clone https://github.com/Shubham1423s/job-tracker-frontend.git
cd job-tracker-frontend
npm install
npm start

### Frontend
git clone https://github.com/Shubham1423s/Job-Tracker.git
cd Job-Tracker
./mvnw spring-boot:run

📁 Frontend Project Structure
src/
 ├── pages/
 │   ├── Login.js
 │   └── Dashboard.js
 ├── services/
 │   └── api.js
 ├── App.js
 ├── index.js
 └── index.css
 
 👤 Author
Shubham

Built with curiosity, persistence, and a passion for clean engineering ❤️
If you found this project useful, feel free to ⭐ the repository.
