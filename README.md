<<<<<<< HEAD
# task-tool
=======
# ✅ Taskly — Full-Stack Todo App

A modern, production-quality Todo app built with **React + Vite** (frontend) and **Node.js + Express** (backend).

---

## 🚀 Quick Start (3 steps)

### Step 1 — Install dependencies

Open **two terminals** in VS Code.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
```

---

### Step 2 — Start the servers

**Terminal 1 — Backend (keep running):**
```bash
cd backend
npm run dev
```
You should see: `🚀 Taskly Backend running on http://localhost:5000`

**Terminal 2 — Frontend (keep running):**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173`

---

### Step 3 — Open the app

Open your browser and go to: **http://localhost:5173**

👉 Click **"Create account"** to sign up and start using the app!

---

## 📁 Project Structure

```
taskly/
├── backend/
│   ├── server.js          ← Express entry point
│   ├── .env               ← Environment variables
│   ├── routes/
│   │   ├── auth.js        ← Signup / Login
│   │   ├── todos.js       ← CRUD for tasks
│   │   └── user.js        ← Profile management
│   ├── middleware/
│   │   ├── auth.js        ← JWT verification
│   │   └── db.js          ← Local JSON database helper
│   └── data/
│       └── db.json        ← Auto-created, stores all data
│
└── frontend/
    ├── src/
    │   ├── App.jsx         ← Router setup
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Settings.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── components/
    │   │   ├── layout/     ← Sidebar, AppLayout
    │   │   ├── tasks/      ← TaskItem, TaskModal, QuickAdd
    │   │   └── common/     ← ProtectedRoute
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── TaskContext.jsx
    │   │   ├── ThemeContext.jsx
    │   │   └── ToastContext.jsx
    │   └── services/
    │       └── api.js      ← All API calls (Axios)
    └── index.css           ← Complete design system
```

---

## ✨ Features

| Feature | Status |
|---|---|
| User Signup / Login | ✅ |
| JWT Authentication | ✅ |
| Add / Edit / Delete tasks | ✅ |
| Mark tasks complete | ✅ |
| Categories (work, personal, study…) | ✅ |
| Priority levels (high, medium, low) | ✅ |
| Due dates with overdue detection | ✅ |
| Search tasks | ✅ |
| Filter by status / category / priority | ✅ |
| Sort tasks (newest, due date, priority) | ✅ |
| Dashboard with progress stats | ✅ |
| Profile editing | ✅ |
| Change password | ✅ |
| Dark mode toggle | ✅ |
| Accent color picker | ✅ |
| Toast notifications | ✅ |
| Responsive layout | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| State | React Context + useReducer |
| Backend | Node.js + Express |
| Auth | JWT + bcryptjs |
| Database | Local JSON file (easy MongoDB upgrade) |

---

## 🗄 Upgrading to MongoDB (later)

When you're ready to deploy:

1. Install mongoose: `npm install mongoose` in backend
2. Replace `middleware/db.js` with a Mongoose connection
3. Create User and Todo models with the schemas in the README
4. Update route files to use `Model.find()` instead of `readDB()`

See the full migration guide in the architecture comments.

---

## 🌐 Deployment (after human review)

**Frontend** → Vercel or Netlify  
**Backend** → Railway or Render (free tier)  
**Database** → MongoDB Atlas (free 512MB)

---

## ⚙️ Environment Variables

Backend `.env` (already configured for local dev):
```
PORT=5000
JWT_SECRET=taskly_super_secret_key_2024_change_in_production
NODE_ENV=development
```

> ⚠️ Change `JWT_SECRET` to a strong random string before deploying!

---

Made with ❤️ — Ready for human review and deployment!
>>>>>>> db5e21a (Initial commit: Taskly React frontend and Express backend)
