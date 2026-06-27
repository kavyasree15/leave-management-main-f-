import api from './api';

/**
 * Leave Service — matches LeaveController endpoints exactly
 */
const leaveService = {
  /**
   * POST /api/leaves/apply
   * Body: { startDate, endDate, leaveType, reason, managerId, medicalCertificate? }
   * Response: LeaveRequest
   * Note: leaveType is ENUM: CASUAL | MEDICAL | PAID | UNPAID
   * Note: medicalCertificate is base64 string (required if medical > 3 business days contiguous)
   */
  applyLeave: (data) => api.post('/api/leaves/apply', data),

  /**
   * POST /api/leaves/{requestId}/approve
   * Role determines behavior (MANAGER or HR)
   * Response: LeaveRequest
   */
  approveLeave: (requestId) => api.post(`/api/leaves/${requestId}/approve`),

  /**
   * POST /api/leaves/{requestId}/reject
   * Response: LeaveRequest
   */
  rejectLeave: (requestId) => api.post(`/api/leaves/${requestId}/reject`),

  /**
   * POST /api/leaves/{requestId}/cancel
   * Can only cancel own leave
   * Response: LeaveRequest
   */
  cancelLeave: (requestId) => api.post(`/api/leaves/${requestId}/cancel`),

  /**
   * GET /api/leaves/balance
   * Response: LeaveBalance { id, userId, casualLeave, medicalLeave, paidLeave }
   * Defaults: casual=12, medical=15, paid=18
   */
  getMyBalance: () => api.get('/api/leaves/balance'),

  /**
   * GET /api/leaves/balance/{userId}
   * Response: LeaveBalance
   */
  getUserBalance: (userId) => api.get(`/api/leaves/balance/${userId}`),

  /**
   * GET /api/leaves/my
   * Response: LeaveRequest[]
   */
  getMyLeaves: () => api.get('/api/leaves/my'),

  /**
   * GET /api/leaves/pending
   * For MANAGER: returns PENDING_MANAGER requests for their team
   * For HR: returns PENDING_HR requests
   * Response: LeaveRequest[]
   */
  getPendingRequests: () => api.get('/api/leaves/pending'),

  /**
   * GET /api/leaves/all
   * Response: LeaveRequest[]
   */
  getAllLeaves: () => api.get('/api/leaves/all'),

  /**
   * POST /api/leaves/escalate
   * Triggers manual escalation of aging pending requests
   * Response: String message
   */
  escalatePendingLeaves: () => api.post('/api/leaves/escalate'),
};

export default leaveService;
