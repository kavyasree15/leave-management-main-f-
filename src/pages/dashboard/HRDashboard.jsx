import React, { useEffect, useState } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button, CircularProgress, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import dayjs from 'dayjs';
import hrService from '../../services/hrService';
import { fetchAllLeaves, fetchPendingRequests } from '../../redux/slices/leaveSlice';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import StatsCard from '../../components/common/StatsCard';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';
import { last30DaysStart, today } from '../../utils/dateUtils';

import PeopleIcon from '@mui/icons-material/People';
import LoginIcon from '@mui/icons-material/Login';
import WarningIcon from '@mui/icons-material/Warning';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AssessmentIcon from '@mui/icons-material/Assessment';

const PIE_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B'];

const HRDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allLeaves, pendingRequests, loading: leaveLoading } = useSelector(state => state.leave);
  const { users, usersLoading } = useSelector(state => state.auth);

  const [attendanceReport, setAttendanceReport] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllLeaves());
    dispatch(fetchAllUsers());
    dispatch(fetchPendingRequests());
    fetchAttendanceReport();
  }, [dispatch]);

  const fetchAttendanceReport = async () => {
    setReportLoading(true);
    try {
      const res = await hrService.getAttendanceReport(last30DaysStart(), today());
      setAttendanceReport(res.data || []);
    } catch (e) {
      setAttendanceReport([]);
    } finally {
      setReportLoading(false);
    }
  };

  const todayDate = dayjs().format('YYYY-MM-DD');
  const totalEmployees = users.length;
  const checkedInToday = attendanceReport.filter(r => r.totalDays > 0).length;
  const lateToday = attendanceReport.filter(r => r.lateCount > 0).length;
  const onLeaveToday = allLeaves.filter(l => {
    const start = l.startDate;
    const end = l.endDate;
    return l.status === 'APPROVED' && start <= todayDate && end >= todayDate;
  }).length;

  // Leave by type data
  const leaveByType = ['CASUAL', 'MEDICAL', 'PAID', 'UNPAID'].map(type => ({
    name: type.charAt(0) + type.slice(1).toLowerCase(),
    total: allLeaves.filter(l => l.leaveType === type).length,
    approved: allLeaves.filter(l => l.leaveType === type && l.status === 'APPROVED').length,
  }));

  // Monthly trend (simulate from allLeaves)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = dayjs().subtract(5 - i, 'month');
    const monthStr = month.format('YYYY-MM');
    return {
      month: month.format('MMM'),
      leaves: allLeaves.filter(l => l.createdAt && l.createdAt.startsWith(monthStr)).length,
      approved: allLeaves.filter(l => l.createdAt && l.createdAt.startsWith(monthStr) && l.status === 'APPROVED').length,
    };
  });

  const pendingHR = pendingRequests.filter(r => r.status === 'PENDING_HR').length;

  return (
    <Box>
      <PageHeader
        title="HR Analytics Dashboard"
        subtitle="System-wide attendance and leave analytics"
        breadcrumbs={[{ label: 'Dashboard' }]}
        action={
          <Button variant="contained" startIcon={<AssessmentIcon />} onClick={() => navigate(ROUTES.HR_ANALYTICS)}>
            Full Reports
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Employees" value={totalEmployees} icon={PeopleIcon} color="primary" loading={usersLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Checked In Today" value={checkedInToday} icon={LoginIcon} color="success" loading={reportLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Late Arrivals" value={lateToday} icon={WarningIcon} color="warning" loading={reportLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="On Leave Today" value={onLeaveToday} icon={EventBusyIcon} color="error" loading={leaveLoading} />
        </Grid>

        {/* Pending HR Leaves */}
        {pendingHR > 0 && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: 'warning.main', bgcolor: 'warning.50' }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WarningIcon color="warning" />
                  <Typography fontWeight={700}>
                    {pendingHR} leave request{pendingHR > 1 ? 's' : ''} awaiting your HR approval
                  </Typography>
                </Box>
                <Button variant="contained" color="warning" onClick={() => navigate(ROUTES.MANAGER_APPROVALS)}>
                  Review Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Monthly Leave Trend */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Monthly Leave Trend</Typography>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Legend />
                    <Line type="monotone" dataKey="leaves" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4 }} name="Total Applied" />
                    <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Approved" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave by Type */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Leaves by Type</Typography>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveByType} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="total" name="Total" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approved" name="Approved" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;
