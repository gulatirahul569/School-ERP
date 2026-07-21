# 🏫 School ERP

A full-stack, role-based School ERP (Enterprise Resource Planning) web app for managing day-to-day school operations — attendance, timetables, results, fees, and announcements — with dedicated portals for **Admins**, **Teachers**, and **Students**.

**🔗 Live demo:** [school-erp-eta-lilac.vercel.app](https://school-erp-eta-lilac.vercel.app/)

> **Demo login:** `admin@gmail.com` / `admin123` *(seeded admin account — see [Getting Started](#getting-started) to create your own)*

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based login with bcrypt-hashed passwords
- Role-based access control (`admin` / `teacher` / `student` / `parent`*) enforced via Express middleware

### 🛠️ Admin Portal
- Create and manage user accounts (students & teachers)
- Create, view, and delete classes; assign/remove students and teachers
- Mark and review attendance across classes
- Build and publish timetables
- Set and manage class fees, and mark fees as paid
- Post announcements
- Dashboard with class, attendance, and fee stats

### 👩‍🏫 Teacher Portal
- View assigned classes and class rosters
- Mark and view attendance for a class
- Enter and update student results by class, subject, and exam
- View timetables
- View fee status for their classes
- Post announcements

### 🎓 Student Portal
- View personal attendance history and timetable
- View exam results
- View personal fee status
- View school announcements
- Manage personal profile

*\* Parent role exists in the data model and has a placeholder dashboard on the frontend, but the corresponding backend API is not yet implemented — see [Roadmap](#roadmap).*

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router 7, Tailwind CSS 4, Axios, Recharts, react-calendar, lucide-react |
| **Backend** | Node.js, Express 5, MongoDB with Mongoose, JSON Web Tokens, bcryptjs |
| **Deployment** | Vercel (frontend) |

---

## 📂 Project Structure

```
School-ERP/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── pages/
│       │   ├── Admin/       # Dashboard, Students, Teachers, Classes,
│       │   │                #   Attendance, Timetable, Fees, Announcements
│       │   ├── Teacher/     # Dashboard, My Classes, Attendance,
│       │   │                #   Results, Timetable, Fees, Announcements
│       │   └── Student/     # Dashboard, Attendance, Results, Timetable,
│       │                    #   Fees, Announcements, Profile
│       ├── Context/         # Auth context
│       ├── routes/          # Protected route wrapper
│       └── services/        # Axios API client
└── server/                  # Express backend
    └── src/
        ├── controllers/
        ├── middleware/      # JWT auth + role-based access
        ├── models/          # User, Student, Teacher, Class, Attendance,
        │                     #   Timetable, Result, Fee, Announcement
        ├── routes/
        └── seed/            # Admin seed script
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB instance (local or MongoDB Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/gulatirahul569/School-ERP.git
cd School-ERP
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Seed an initial admin account:
```bash
node src/seed/adminseed.js
```
This creates an admin user — `admin@gmail.com` / `admin123` (change the password after first login).

Start the server:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

The client runs on Vite's default port (`http://localhost:5173`) and talks to the API on `http://localhost:5000`.

---

## 🔌 API Overview

| Route | Description |
|---|---|
| `/api/auth` | Login |
| `/api/user` | User CRUD (admin), profile |
| `/api/class` | Class CRUD, student/teacher assignment |
| `/api/attendance` | Mark & fetch attendance |
| `/api/timetable` | Create/fetch timetables |
| `/api/result` | Enter results, fetch by student/class/sheet |
| `/api/fee` | Set class fees, fetch, mark as paid |
| `/api/announcement` | Create/fetch/delete announcements |
| `/api/admin` | Admin dashboard stats |
| `/api/teacher` | Teacher dashboard |

All routes except `/api/auth/login` require a `Bearer` JWT and enforce role-based access.

---

## 🗺️ Roadmap

- [ ] Parent portal backend endpoints (frontend dashboard exists as a placeholder)
- [ ] Notifications
- [ ] Automated tests
- [ ] Containerized / cloud deployment guide for the backend

---


## 📄 License

No license specified yet — all rights reserved by default until one is added.