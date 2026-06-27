# TechNova HRMS Frontend Client Portal

Welcome to the frontend application for the **TechNova HRMS** portal. This is a modern, high-fidelity Single Page Application (SPA) designed to give Employees, Managers, HR, and Admins a streamlined portal to manage schedules, attendance, registrations, and leaves.

---

## 1. Technology Stack

* **Core:** React 19, Vite (for super-fast bundling and Hot Module Replacement).
* **State Management:** Redux Toolkit (`react-redux`, `@reduxjs/toolkit`) for global reactive states.
* **Styling & UI:** Material-UI (MUI v6) for robust UI components, combined with custom CSS/Vanilla variables for premium dark-mode panels and glassmorphism.
* **Charts & Analytics:** Recharts for vector-rendered data visualizations (leave distribution, monthly trends).
* **Animations:** Framer Motion for smooth component entrance transitions and hover card micro-animations.

---

## 2. Codebase Structure & Why Files Exist

### A. Core Routing (`src/App.jsx` & `src/constants/routes.js`)
* **Why it exists:** Configures all URL entry points.
* **Design:** Uses a `PrivateRoute` wrapper that checks the Redux `auth` state. If the user is authenticated, it routes them to their specific dashboard based on their role (`ADMIN`, `MANAGER`, `HR`, `EMPLOYEE`). Unauthenticated users are redirected to `/login`.

### B. Global State Slices (`src/redux/slices/`)
We use Redux to keep backend responses synchronized across views without spamming API requests:
* **`authSlice.js`:** Stores JWT tokens, authenticated user profiles, manager list, and user collection. Exposes the `approveUser` async thunk which persists approvals to the backend database.
* **`leaveSlice.js`:** Handles leave application, balances, and pending approvals.
* **`attendanceSlice.js`:** Stores check-in states, daily timelines, and attendance history logs.

### C. Services Layer (`src/services/`)
* **`api.js`:** Creates an Axios client preconfigured with base URLs, headers, and request interceptors that automatically inject the stored JWT token into backend requests.
* **`authService.js` / `leaveService.js` / `attendanceService.js` / `hrService.js`:** Abstract direct API calls to keep component files clean.

---

## 3. Role-Based Dashboards (Business Logic implementation)

### A. Employee Dashboard
* **Main Actions:** Mark daily attendance (check-in/check-out) and track current session times.
* **Apply Leave Form:** Validates leave applications. Prevents submission if the user has an insufficient balance or if a medical leave exceeding 3 days does not have a medical certificate uploaded.

### B. Manager Dashboard (Updated)
* **Statistics Panels:** Shows *Pending Approvals*, *Approved Leaves*, and *Total Requests*.
* **Manager-Only Filtering:** Updated to filter statistics specifically by the logged-in manager's ID (`l.managerId === user?.userId`). Managers will only see metrics for employees under their direct command.
* **Inclusive Status Count:** Counts both `APPROVED` and `PENDING_HR` requests as approved on the manager's counters (since a manager-approved request of >=10 days moves to `PENDING_HR` status while waiting for HR confirmation, but has already been approved by the manager).

### C. HR Analytics Dashboard
* **System-wide Metrics:** Shows total company headcount, checked-in staff count, late arrivals, and staff currently on leave.
* **10+ Days Leave Approval Panel:** Displays a dedicated banner for any leave request >= 10 days that has been approved by a manager and is currently awaiting final HR approval.

### D. Admin Dashboard
* **Registration Approvals:** Lists all pending employee registrations.
* **Recent Bug Fix:** The approval list utilizes the newly serialized `approved` field from the backend to ensure approved users disappear permanently from the registration requests queue upon page reload.

---

## 4. How to Run Locally

### Setup Commands
1. Navigate to the frontend directory:
   ```bash
   cd c:\Users\kavya\Downloads\leave-management-main(F)
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Build the application for production deployment:
   ```bash
   npm run build
   ```
