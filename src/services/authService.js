import api from './api';

/**
 * Auth Service — matches AuthController endpoints exactly
 */
const authService = {
  /**
   * POST /api/auth/login
   * Body: { email, password }
   * Response: { token, username, role, userId }
   */
  login: (credentials) => api.post('/api/auth/login', credentials),

  /**
   * POST /api/auth/register
   * Body: { username, password, role, managerId?, email }
   * Response: UserResponse { id, username, role, managerId, email }
   */
  register: (data) => api.post('/api/auth/register', data),

  /**
   * GET /api/auth/users/{id}
   * Response: UserResponse
   */
  getUserById: (id) => api.get(`/api/auth/users/${id}`),

  /**
   * GET /api/auth/users
   * Response: UserResponse[]
   */
  getAllUsers: () => api.get('/api/auth/users'),

  /**
   * GET /api/auth/managers
   * Response: UserResponse[] (only MANAGER role users)
   */
  getManagers: () => api.get('/api/auth/managers'),

  /**
   * POST /api/auth/approve/{userId}
   * Requires ADMIN role (X-User-Role header set by gateway)
   * Response: "approved"
   */
  approveUser: (userId) => api.post(`/api/auth/approve/${userId}`),
};

export default authService;
