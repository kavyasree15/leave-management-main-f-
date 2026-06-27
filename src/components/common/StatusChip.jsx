import React from 'react';
import { Chip } from '@mui/material';
import { LEAVE_STATUS } from '../../constants/leaveTypes';

/**
 * StatusChip — colored chip for leave status display
 */
const StatusChip = ({ status, size = 'small' }) => {
  const config = LEAVE_STATUS[status] || { label: status, color: 'default' };

  const colorMap = {
    warning: { bgcolor: '#FEF3C7', color: '#92400E' },
    info: { bgcolor: '#DBEAFE', color: '#1E40AF' },
    success: { bgcolor: '#D1FAE5', color: '#065F46' },
    error: { bgcolor: '#FEE2E2', color: '#991B1B' },
    default: { bgcolor: '#F1F5F9', color: '#475569' },
  };

  const styles = colorMap[config.color] || colorMap.default;

  return (
    <Chip
      label={config.label || status}
      size={size}
      sx={{
        ...styles,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.72rem' : '0.8rem',
        border: 'none',
      }}
    />
  );
};

export default StatusChip;
