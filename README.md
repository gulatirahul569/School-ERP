# School ERP

A full-stack, role-based School ERP (Enterprise Resource Planning) web app for managing day-to-day school operations — classes, attendance, timetables, and announcements — with separate portals for Admins, Teachers, Students, and Parents.

> **Status:** Work in progress. Core modules (auth, classes, attendance, timetable, announcements) are functional. Exam/results and full parent-portal APIs are still being built — see [Roadmap](#roadmap).

## Features

- **Authentication & Authorization** — JWT-based login with bcrypt-hashed passwords and role-based access control (admin / teacher / student / parent) enforced via middleware.
- **Admin Portal**
  - Create and manage user accounts (students, teachers, parents)
  - Create, view, and delete classes
  - Assign/remove students and teachers to/from classes
  - Dashboard with class and attendance stats
- **Teacher Portal**
  - View assigned classes and class details
  - Mark and view attendance for a class
  - View and manage timetable
  - Post announcements
- **Student Portal**
  - View personal attendance, timetable, and profile
  - View school announcements
- **Attendance** — mark attendance by class/date, and query by student, by date, or full class history.
- **Timetable** — admin-managed timetables, viewable per class, per teacher, or per student.
- **Announcements** — role-restricted creation (admin/teacher), visible to all authenticated users.

## Tech Stack

**Frontend:** React 19, Vite, React Router, Tailwind CSS, Axios, Recharts, react-calendar
**Backend:** Node.js, Express 5, MongoDB with Mongoose, JSON Web Tokens, bcryptjs

## Project Structure

```
School-ERP/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Admin, Teacher, Student page views
│       ├── Context/ # Auth context
│       ├── routes/  # Protected route wrapper
│       └── services/# Axios API client
└── server/          # Express backend
    └── src/
        ├── controllers/
        ├── middleware/  # JWT auth + role-based access
        ├── models/      # Mongoose schemas
        ├── routes/
        └── seed/        # Admin seed script
```

## Getting Started

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
npm run dev
```

The client runs on Vite's default port (`http://localhost:5173`) and the API on `http://localhost:5000`.

## API Overview

| Route | Description |
|---|---|
| `/api/auth` | Login |
| `/api/user` | User CRUD (admin), profile |
| `/api/class` | Class CRUD, student/teacher assignment |
| `/api/attendance` | Mark & fetch attendance |
| `/api/timetable` | Create/fetch timetables |
| `/api/announcement` | Create/fetch/delete announcements |
| `/api/admin` | Admin dashboard stats |
| `/api/teacher` | Teacher dashboard |

All routes except `/api/auth/login` require a `Bearer` JWT and enforce role-based access.

## Roadmap
 
- [ ] Exam & results / grading module
- [ ] Parent portal backend endpoints
- [ ] Fee management
- [ ] Notifications
- [ ] Deployment guide (Docker / cloud hosting)


## Contributing

This is a learning/portfolio project and still evolving. Issues and PRs are welcome.

## License

No license specified yet — all rights reserved by default until one is added.