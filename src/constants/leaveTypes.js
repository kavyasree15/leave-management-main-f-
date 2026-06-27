export const LEAVE_TYPES = [
  { value: 'CASUAL', label: 'Casual Leave', color: 'info', maxDays: 12 },
  { value: 'MEDICAL', label: 'Medical Leave', color: 'error', maxDays: 15 },
  { value: 'PAID', label: 'Paid Leave', color: 'success', maxDays: 18 },
  { value: 'UNPAID', label: 'Unpaid Leave', color: 'warning', maxDays: null },
];

export const LEAVE_STATUS = {
  PENDING_MANAGER: { label: 'Pending Manager', color: 'warning' },
  PENDING_HR: { label: 'Pending HR', color: 'info' },
  APPROVED: { label: 'Approved', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'error' },
  CANCELLED: { label: 'Cancelled', color: 'default' },
};

export const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  MANAGER: 'MANAGER',
  HR: 'HR',
  ADMIN: 'ADMIN',
};

export const LEAVE_BALANCE_DEFAULTS = {
  CASUAL: 12,
  MEDICAL: 15,
  PAID: 18,
};

export const LATE_THRESHOLD = '09:15';
