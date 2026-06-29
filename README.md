# TechNova HRMS Frontend Portal: Architecture & Workflow Guide

Welcome to the client portal frontend for **TechNova HRMS** (Human Resource Management System). This is a modern, high-fidelity React Single Page Application (SPA) designed to give Employees, Managers, HR, and Admins a streamlined portal to manage schedules, attendance, registrations, and leaves.

This document details the frontend architecture, state management patterns, and interactive workflows designed to deliver a premium user experience.

---

## 1. System Technology Stack

* **Core Framework:** React 19 + Vite (for lightning-fast bundling, startup, and Hot Module Replacement).
* **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) for managing centralized, reactive global states (auth, leaves, attendance).
* **UI Component Library:** Material-UI (MUI v6) with a dark-mode theme, smooth glassmorphism shadows, and responsive grid layouts.
* **Component Animations:** Framer Motion for premium micro-animations (smooth page slide transitions and card hover animations).
* **Vector Visualizations:** Recharts for rendering charts (leave type distributions, attendance trends).
* **Form Management:** React Hook Form + Yup for high-performance client-side validation.

---

## 2. Core Frontend Architecture (The "How" it works)

```
                       [Browser Client]
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            [AppRouter / Routes]   [Redux Slices]
                    │                   │
                    ├─────────◄─────────┘
                    ▼
            [Protected Routes]
                    │
            ┌───────┼───────┐
            ▼       ▼       ▼
         [Admin]  [HR]  [Manager] -> [Employee Details Dialog]
                                               │
                                       ┌───────┼───────┐
                                       ▼       ▼       ▼
                                   [Balance] [Leaves] [Attendance]
                                   (Parallel async fetches)
```

### A. Centralized Routing & Role Guards
* **How:** Configured in `src/routes/AppRouter.jsx` and `src/constants/routes.js`.
* **Guard Pattern:**
  * **`ProtectedRoute`**: Verifies if the user's token exists. If not, it redirects the browser to `/login` and saves the target path in navigation state.
  * **`RoleRoute`**: Wraps routes to enforce access control (e.g., preventing Employees from accessing `/hr/dashboard` or `/manager/kyc-approvals`).
  * **`DashboardRouter`**: A dynamic switcher component that reads the logged-in user's role from Redux and renders their specific dashboard (`AdminDashboard`, `HRDashboard`, `ManagerDashboard`, or `EmployeeDashboard`).

### B. Axios API Interceptors & JWT Propagation
* **How:** Defined in `src/services/api.js`.
* **Request Interceptor:** Automatically extracts the JWT token from `localStorage` or `sessionStorage` and appends it to the `Authorization: Bearer <token>` header of every outgoing REST request.
* **Response Interceptor:** Intercepts response errors. If any service call returns a `401 Unauthorized` (indicating the session has expired or is invalid), it automatically wipes the stored tokens and redirects the user back to the login portal.

### C. Centralized Redux State Management
We use Redux slices (`src/redux/slices/`) to keep our application fast and prevent unnecessary API duplicate polling:
* **`authSlice.js`:** Handles user login, profile persistence, and fetches the list of reporting users.
* **`leaveSlice.js`:** Manages leave balance states, leave submissions, and pending manager/HR approvals.
* **`attendanceSlice.js`:** Monitors daily check-in status, timelines, and check-in/out history logs.

---

## 3. Deep-Dive: Key Workflows & User Interfaces

### ✈️ Leave Application Form
* **Path:** `src/pages/leave/ApplyLeave.jsx`
* **Automated Design:** The manager selector dropdown is hidden. The employee's request payload sets `managerId: 0` because the backend resolves their reporting manager automatically based on the database mapping.
* **Smart Banner:** Displays a customized context banner based on the role:
  * Managers: *"As a Manager, your leave requests are submitted directly to HR for approval."*
  * Employees: *"Your leave requests are automatically routed to your assigned reporting manager mapped by HR."*

### 👥 Manager's Employee Details Dialog (Advanced UX)
* **Path:** `src/pages/manager/ManagerTeam.jsx`
* **Action:** Clicking on an employee's name or clicking **"View Details"** opens a high-fidelity dialog showing their complete dashboard.
* **Asynchronous Resilience:** To prevent a single backend service delay or crash from blocking the entire popup, the modal uses parallel async fetches via `Promise.all` wrapped in separate `try-catch` blocks:
  1. `getUserBalance(member.id)` -> Renders Casual, Medical, and Paid leaves.
  2. `getUserLeaves(member.id)` -> Renders all leaves applied by them.
  3. `getUserAttendanceBetween(member.id, start, end)` -> Renders attendance logs.
* **User Feedback:** Utilizes progress spinners while loading and clear empty states (*"No leaves applied by this user yet"*) when data is absent.

### 🕒 Daily Attendance Panel
* **Path:** `src/pages/attendance/AttendancePage.jsx`
* **Features:** A single-click toggle button for Check-In / Check-Out.
* **KYC Guard:** If an employee's KYC status is not `APPROVED` by their manager, the UI locks the page and directs them to complete their KYC.

---

## 4. How to Run Locally

### Setup Commands
1. **Navigate to the frontend directory**:
   ```bash
   cd c:\Users\kavya\Downloads\leave-management-main(F)
   ```
2. **Install all dependencies**:
   ```bash
   npm install
   ```
3. **Launch the development server**:
   ```bash
   npm run dev
   ```
4. **Compile for production**:
   ```bash
   npm run build
   ```
