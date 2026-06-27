import api from './api';

/**
 * HR Service — matches HrController endpoints exactly
 * Requires HR or ADMIN role
 */
const hrService = {
  /**
   * GET /api/hr/reports/attendance
   * Params: userId? (optional), start (ISO date), end (ISO date)
   * Response: AttendanceReport[] { userId, username, totalDays, lateCount, totalHours, avgHours }
   */
  getAttendanceReport: (start, end, userId = null) => {
    const params = { start, end };
    if (userId) params.userId = userId;
    return api.get('/api/hr/reports/attendance', { params });
  },

  /**
   * GET /api/hr/reports/leaves
   * Params: userId? (optional)
   * Response: LeaveUtilizationReport[] {
   *   userId, username,
   *   casualTaken, casualRemaining,
   *   medicalTaken, medicalRemaining,
   *   paidTaken, paidRemaining,
   *   unpaidTaken
   * }
   */
  getLeaveReport: (userId = null) => {
    const params = {};
    if (userId) params.userId = userId;
    return api.get('/api/hr/reports/leaves', { params });
  },
};

export default hrService;
