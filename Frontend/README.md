# Expense-Tracker Frontend

A secure, premium React-based frontend application for managing personal/company expenses. It enforces Role-Based Access Control (Admin vs. SuperAdmin), communicates securely with a backend API using JWT interceptors, and presents data through a sleek, modern UI utilizing glassmorphism and light/dark modes.

---

## 🚀 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Execution

1. **Install Dependencies**
   Run the following command in the project directory to install all necessary packages:
   ```bash
   npm install
   ```
   *(This installs `react-router-dom`, `axios`, `lucide-react`, and other core dependencies.)*

2. **Start the Development Server**
   Start the React visual client natively:
   ```bash
   npm start
   ```
   This will spin up a local development server on [http://localhost:3000](http://localhost:3000). The page will reload if you make code edits.

3. **Build for Production**
   To bundle the application into static files for deployment:
   ```bash
   npm run build
   ```

---

## 🛠 Tech Stack

- **Core Framework**: React.js (v19)
- **Styling**: Pure CSS (`index.css`) with highly curated custom variables, global theme management, and modular classes.
- **Routing**: `react-router-dom` with robust Protected/Private Routing capabilities.
- **API State & Lifecycle**: `axios` equipped with custom request/response interceptors to handle seamless JWT authentication tagging.
- **Icons**: `lucide-react` for beautiful, lightweight, resolution-independent SVGs.
- **Auth Management**: Centralized React `AuthContext` to manage local session hydration across the application.

---

## 📁 Key Directories & Architecture

- `src/api/axios.js` – Contains logic specifying the `API_BASE_URL` (`http://localhost:5000/api`) and sets up interceptors to attach Authorization headers and globally catch `401 Unauthorized` flows.
- `src/components/` – Reusable layout components including the globally rendered `Navbar.js` and the `PrivateRoute.js` wrapper.
- `src/context/AuthContext.js` – Dispatches login/logout requests and exposes contextual hooks to verify if a user is presently authenticated and what role they hold.
- `src/pages/` – Views bound to specific URL Routes:
  - **Login / Landing**: Visceral auth gatekeeping point.
  - **Dashboard**: Standard entry point rendering Transaction filtering algorithms and Total Income/Expense dynamic summary cards.
  - **SuperAdminPanel**: Interface constrained logically for viewing native platform administrators and mutating their active credentials.
  - **AllTransactions**: A global viewport designated by wireframes strictly for tracking system-wide mutations.

---

## ⚠️ Backend Requirement

This frontend application assumes a companion Node.js/Express.js RESTful API is running on **port 5000**.
If you attempt to log in or manipulate data, Axios will target `http://localhost:5000/api`. Make sure your backend server is active and properly handling CORS configurations from origin `http://localhost:3000`.

*(Note: Currently in the codebase, the UI holds a graceful fallback "Mock" pattern returning dummy data to allow visual debugging while the backend is taken offline.)*
