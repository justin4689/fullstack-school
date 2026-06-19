# EduManager — School Management Dashboard

A full-stack school management system built with Next.js 16, React 19, Prisma 7, and Neon DB.

## Screenshots

### Login Page
![Login](./public/screenshort2%20(1).png)

### Student Dashboard
![Dashboard](./public/screenshort2%20(2).png)

## Demo Credentials

All accounts use the password: **`password123`**

| Role    | Username     |
|---------|-------------|
| Admin   | `admin1`    |
| Admin   | `admin2`    |
| Teacher | `teacher1` → `teacher15` |
| Student | `student1` → `student50` |
| Parent  | `parentId1` → `parentId25` |

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **UI**: React 19 + Tailwind CSS
- **ORM**: Prisma 7 + `@prisma/adapter-neon`
- **Database**: Neon (PostgreSQL serverless)
- **Auth**: Custom JWT (HTTP-only cookie)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file at the root:

```env
DATABASE_URL=your_neon_connection_string
DIRECT_URL=your_neon_direct_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Push the schema and seed the database

```bash
npx prisma db push
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Role-based access control (admin, teacher, student, parent)
- Full CRUD for: teachers, students, parents, classes, subjects, lessons, exams, assignments, results, events, announcements
- Search and sort on all list pages
- Attendance tracking (read-only)
- Weekly schedule calendar per student/teacher
- Responsive design (mobile + desktop)
