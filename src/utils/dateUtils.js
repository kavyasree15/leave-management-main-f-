import dayjs from 'dayjs';

/**
 * Format a date to display string
 */
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '—';
  return dayjs(date).format(format);
};

/**
 * Format datetime to display string
 */
export const formatDateTime = (dt, format = 'MMM DD, YYYY HH:mm') => {
  if (!dt) return '—';
  return dayjs(dt).format(format);
};

/**
 * Format time only
 */
export const formatTime = (dt, format = 'HH:mm:ss') => {
  if (!dt) return '—';
  return dayjs(dt).format(format);
};

/**
 * Calculate business days (excluding weekends) between two dates
 */
export const calculateBusinessDays = (start, end) => {
  if (!start || !end) return 0;
  let count = 0;
  let current = dayjs(start);
  const endDate = dayjs(end);
  while (!current.isAfter(endDate)) {
    const dow = current.day();
    if (dow !== 0 && dow !== 6) count++;
    current = current.add(1, 'day');
  }
  return count;
};

/**
 * Get today's date in ISO format
 */
export const today = () => dayjs().format('YYYY-MM-DD');

/**
 * Check if a time is after the late threshold (09:15)
 */
export const isLate = (checkInTime) => {
  if (!checkInTime) return false;
  const checkIn = dayjs(checkInTime);
  const threshold = dayjs(checkInTime).hour(9).minute(15).second(0);
  return checkIn.isAfter(threshold);
};

/**
 * Get duration string from hours
 */
export const formatHours = (hours) => {
  if (hours == null) return '—';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

/**
 * Get relative time string
 */
export const fromNow = (dt) => {
  if (!dt) return '';
  return dayjs(dt).fromNow ? dayjs(dt).fromNow() : '';
};

/**
 * Get start of month
 */
export const startOfMonth = (date = dayjs()) => dayjs(date).startOf('month').format('YYYY-MM-DD');

/**
 * Get end of month
 */
export const endOfMonth = (date = dayjs()) => dayjs(date).endOf('month').format('YYYY-MM-DD');

/**
 * Get start of last 30 days
 */
export const last30DaysStart = () => dayjs().subtract(30, 'day').format('YYYY-MM-DD');
