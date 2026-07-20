# ClinicFlow — Premium Clinic Management Platform

ClinicFlow is a production-ready, full-stack website and clinic management portal designed specifically for Dr. Ali Ahmed (Dermatologist) in Karachi.

---

## 🎨 Color Palette & Aesthetics
This platform applies a strictly curated, high-end visual theme:
* **Deep Navy (`#0A1628`)** — Primary background blocks.
* **Teal/Green (`#00D4AA`)** — Actions, highlights, and confirmations.
* **Gold (`#FFB800`)** — Professional credentials, reviews, and badges.
* **Light Gray (`#F5F7FA`)** — Section contrasts.
* **NO** glassmorphism, **NO** purple, **NO** default generic blue.

---

## 🚀 Setup Instructions

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **PostgreSQL** database running locally or hosted

### 1. Database Creation
Create a new database in PostgreSQL named `clinicflow`:
```sql
CREATE DATABASE clinicflow;
```

---

### 2. Backend Server Configuration

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit environment variables in `.env`:
   Make sure the `DATABASE_URL` matches your local PostgreSQL username, password, and port:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/clinicflow
   JWT_SECRET=supersecretclinicflowjwtkey123!
   ```
4. Run the database seed script to initialize schemas and default doctor profile/timings/services:
   ```bash
   npm run seed
   ```
   *(Note: This creates default doctor login credentials and sample patients/appointments).*
5. Start the backend developer server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Client Configuration

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *(Note: Vite is configured to proxy all `/api` calls directly to the Express server on port 5000, eliminating CORS problems).*
4. Open your browser and navigate to the address shown (usually `http://localhost:3000`).

---

## 🩺 Default Doctor Credentials (Initialized via Seed)
* **Email:** `doctor@clinicflow.com`
* **Password:** `password123`
* **Profile Link:** Navigate to `http://localhost:3000/login` to access the Doctor Dashboard.
