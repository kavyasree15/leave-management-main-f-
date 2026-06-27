import api from './api';

/**
 * Attendance Service — matches AttendanceController endpoints exactly
 * Note: userId is injected from JWT by API Gateway as X-User-Id header
 */
const attendanceService = {
  /**
   * POST /api/attendance/checkin
   * No body needed — userId comes from JWT header
   * Response: Attendance { id, userId, date, checkIn, checkOut, late, workingHours }
   */
  checkIn: () => api.post('/api/attendance/checkin'),

  /**
   * POST /api/attendance/checkout
   * No body needed — userId comes from JWT header
   * Response: Attendance
   */
  checkOut: () => api.post('/api/attendance/checkout'),

  /**
   * GET /api/attendance/today
   * Response: Attendance or null
   */
  getTodayRecord: () => api.get('/api/attendance/today'),

  /**
   * GET /api/attendance/history
   * Response: Attendance[]
   */
  getUserHistory: () => api.get('/api/attendance/history'),

  /**
   * GET /api/attendance/range?start=&end=
   * Params: start (ISO date), end (ISO date)
   * Response: Attendance[]
   */
  getAttendanceBetween: (start, end) =>
    api.get('/api/attendance/range', { params: { start, end } }),

  /**
   * GET /api/attendance/user/{userId}/range?start=&end=
   * Params: start, end
   * Response: Attendance[]
   */
  getUserAttendanceBetween: (userId, start, end) =>
    api.get(`/api/attendance/user/${userId}/range`, { params: { start, end } }),
};

export default attendanceService;
