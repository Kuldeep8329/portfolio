# Kuldeep Mahajan - Professional Personal Portfolio Website

This is a premium, full-stack personal portfolio web application built with **React** on the frontend and **Node.js + Express** on the backend. The design uses **Tailwind CSS v4** for next-generation styles, **Framer Motion** for liquid section reveals, and custom **3D tilt hover cards** for high-end micro-interactions.

---

## Project Structure

```text
Portfolio Kuldeep/
├── backend/                  # Node.js + Express Backend
│   ├── controllers/          # API Controller Logic
│   ├── data/                 # Structured JSON Database
│   │   ├── profile.json      # Full Name, Location, Bio
│   │   ├── skills.json       # Categorized Tech Skills
│   │   ├── projects.json     # Dynamic Projects List
│   │   ├── experience.json   # Work/Internship History
│   │   ├── education.json    # Degree details
│   │   ├── certifications.json
│   │   ├── awards.json       # Recognition and Honors
│   │   └── contacts.json     # Saved Contact Form Submissions
│   ├── routes/               # Express API Endpoints
│   ├── .env                  # Environment Configuration
│   ├── server.js             # Express Entry Point
│   └── package.json
│
├── frontend/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable Visual Elements
│   │   │   ├── Sections/     # Section Pages (Hero, About, Contact, etc.)
│   │   │   ├── LiquidBackground.jsx # Organic Blob Animation Canvas
│   │   │   ├── Navbar.jsx    # Glassmorphic Sticky Header
│   │   │   ├── Footer.jsx    # Footer with custom Social SVGs
│   │   │   └── TiltCard.jsx  # Reusable 3D Tilt Component
│   │   ├── App.jsx           # Main API integration container
│   │   ├── index.css         # Global Styles & Tailwind Config
│   │   └── main.jsx
│   ├── vite.config.js        # Vite + Tailwind v4 Plugin Configuration
│   └── package.json
│
└── README.md                 # Project Documentation
```

---

## Technical Features

1. **Vibrant Futuristic Aesthetics**: Dark theme featuring background grid overlays, blurred glassmorphic panels (`backdrop-filter`), and floating fluid liquid blobs.
2. **3D Card Hover Effects**: Pure CSS/React hardware-accelerated 3D rotations based on mouse cursor calculations (no heavy WebGL/Three.js required).
3. **Advanced Micro-Animations**: Smooth section scroll spy tracking, staggered list entry reveals, and custom loading states.
4. **Dynamic Data Engine**: Express backend routes serve data dynamically from structured JSON files, ensuring effortless maintenance.
5. **Robust Local Submissions**: Captures contact form requests, runs schema validations (e.g. email patterns, length checks), and writes submissions safely to a local database.

---

## Setup & Running Instructions

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- npm (installed with Node.js)

### Step 1: Start the Backend API Server
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server in development mode:
   ```bash
   npm run dev
   ```
   The backend will start running on [http://localhost:5000](http://localhost:5000).

### Step 2: Start the Frontend Application
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the local server address, typically [http://localhost:5173](http://localhost:5173).

---

## Modifying Portfolio Content

All portfolio text, details, skills, certifications, awards, and experience entries are fully dynamic and fetched from the backend. You can update your content by editing the files inside `backend/data/`:
- Edit `backend/data/profile.json` to change your name, summary, or contact info.
- Edit `backend/data/skills.json` to add or update technical skills.
- Edit `backend/data/projects.json` to document new projects.
- Submissions from the contact form are stored in `backend/data/contacts.json`.
