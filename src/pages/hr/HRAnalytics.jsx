import React from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { ROUTES } from '../../constants/routes';

const HRAnalytics = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="HR Reports & Analytics"
        subtitle="Access organization-wide attendance records, leave utilization, and metrics"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports' }]}
      />

      <Stack spacing={3}>
        {/* Attendance Reports navigation */}
        <Card sx={{ borderRadius: 3, cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }} onClick={() => navigate(ROUTES.HR_ATTENDANCE_REPORT)}>
          <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
              <BarChartIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>Shift & Attendance Reports</Typography>
              <Typography variant="body2" color="text.secondary">
                Audit daily check-ins, check-outs, late arrival flags, average working hours, and total active shift days across all employees.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Leave Reports navigation */}
        <Card sx={{ borderRadius: 3, cursor: 'pointer', '&:hover': { boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }} onClick={() => navigate(ROUTES.HR_LEAVE_REPORT)}>
          <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'success.main', color: 'white' }}>
              <TimelineIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>Leave Balance & Utilization Reports</Typography>
              <Typography variant="body2" color="text.secondary">
                Track leave balance distributions, total leaves taken by category (Casual, Medical, Paid, Unpaid), and remaining balances.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default HRAnalytics;
