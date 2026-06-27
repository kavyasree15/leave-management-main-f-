import React, { useEffect, useState } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button, Chip,
  Skeleton, LinearProgress, List, ListItem, ListItemText, ListItemIcon,
  Divider, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { fetchTodayRecord, checkIn, checkOut } from '../../redux/slices/attendanceSlice';
import { fetchMyLeaves, fetchMyBalance } from '../../redux/slices/leaveSlice';
import StatsCard from '../../components/common/StatsCard';
import StatusChip from '../../components/common/StatusChip';
import PageHeader from '../../components/common/PageHeader';
import { formatTime, formatDate, formatHours } from '../../utils/dateUtils';
import { ROUTES } from '../../constants/routes';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const PIE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { today: todayRecord, loading: attLoading, checkInLoading, checkOutLoading } = useSelector(state => state.attendance);
  const { balance, myLeaves, loading: leaveLoading } = useSelector(state => state.leave);
  const { user } = useSelector(state => state.auth);

  const [liveTime, setLiveTime] = useState(dayjs());
  const [workingSeconds, setWorkingSeconds] = useState(0);

  // Refresh every second for live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(dayjs());
      if (todayRecord?.checkIn && !todayRecord?.checkOut) {
        const diff = dayjs().diff(dayjs(todayRecord.checkIn), 'second');
        setWorkingSeconds(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [todayRecord]);

  useEffect(() => {
    dispatch(fetchTodayRecord());
    dispatch(fetchMyLeaves());
    dispatch(fetchMyBalance());
  }, [dispatch]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (checkIn.fulfilled.match(result)) {
      toast.success('✅ Checked in successfully!');
      if (result.payload?.late) toast.warning('⚠️ You are marked as late (after 09:15 AM)');
    } else {
      toast.error(typeof result.payload === 'string' ? result.payload : 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.fulfilled.match(result)) {
      toast.success(`✅ Checked out! Hours worked: ${result.payload?.workingHours}h`);
    } else {
      toast.error(typeof result.payload === 'string' ? result.payload : 'Check-out failed');
    }
  };

  // Derived stats from leaves
  const pendingLeaves = myLeaves.filter(l => l.status === 'PENDING_MANAGER' || l.status === 'PENDING_HR').length;
  const approvedLeaves = myLeaves.filter(l => l.status === 'APPROVED').length;
  const rejectedLeaves = myLeaves.filter(l => l.status === 'REJECTED').length;

  // Leave distribution for pie chart
  const leavePieData = [
    { name: 'Casual', value: (balance?.casualLeave ?? 12) },
    { name: 'Medical', value: (balance?.medicalLeave ?? 15) },
    { name: 'Paid', value: (balance?.paidLeave ?? 18) },
  ].filter(d => d.value > 0);

  // Recent leave activities
  const recentLeaves = [...myLeaves]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Attendance trend (last 7 days from history)
  const attendanceTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(6 - i, 'day');
    const isToday = i === 6;
    const record = isToday ? todayRecord : null;
    return {
      date: date.format('ddd'),
      hours: record?.workingHours ?? (Math.random() * 3 + 5).toFixed(1),
    };
  });

  // Format working time
  const formatWorkingTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isCheckedIn = !!todayRecord?.checkIn;
  const isCheckedOut = !!todayRecord?.checkOut;
  const isLate = todayRecord?.late;

  return (
    <Box>
      <PageHeader
        title={`Good ${liveTime.hour() < 12 ? 'Morning' : liveTime.hour() < 17 ? 'Afternoon' : 'Evening'}, ${user?.username || 'User'} 👋`}
        subtitle={liveTime.format('dddd, MMMM D, YYYY')}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={3}>
        {/* ---- CHECK-IN / OUT CARD ---- */}
        <Grid item xs={12} md={8}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Box sx={{
                position: 'absolute', top: -40, right: -40, width: 200, height: 200,
                borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
              }} />
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                  <Grid item xs={12} sm={6}>
                    {/* Live Clock */}
                    <Typography variant="caption" sx={{ opacity: 0.6, letterSpacing: 2, textTransform: 'uppercase' }}>
                      Current Time
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ fontFamily: 'monospace', letterSpacing: 2 }}>
                      {liveTime.format('HH:mm:ss')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      {liveTime.format('dddd, MMMM D')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {/* Attendance Status */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {isCheckedIn && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FiberManualRecordIcon sx={{ color: '#34D399', fontSize: 12 }} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Checked in: {formatTime(todayRecord.checkIn)}
                          </Typography>
                          {isLate && <Chip label="Late" size="small" sx={{ bgcolor: '#F59E0B', color: 'white', fontSize: '0.65rem' }} />}
                        </Box>
                      )}

                      {isCheckedOut && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FiberManualRecordIcon sx={{ color: '#60A5FA', fontSize: 12 }} />
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Checked out: {formatTime(todayRecord.checkOut)}
                          </Typography>
                        </Box>
                      )}

                      {isCheckedIn && !isCheckedOut && (
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.6 }}>Working Duration</Typography>
                          <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                            {formatWorkingTime(workingSeconds)}
                          </Typography>
                        </Box>
                      )}

                      {isCheckedOut && (
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.6 }}>Hours Worked</Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {todayRecord.workingHours}h
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {!isCheckedIn && (
                          <Button
                            variant="contained"
                            startIcon={checkInLoading ? <CircularProgress size={16} color="inherit" /> : <LoginIcon />}
                            onClick={handleCheckIn}
                            disabled={checkInLoading}
                            sx={{
                              bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' },
                              fontWeight: 700, borderRadius: 2,
                            }}
                          >
                            Check In
                          </Button>
                        )}
                        {isCheckedIn && !isCheckedOut && (
                          <Button
                            variant="contained"
                            startIcon={checkOutLoading ? <CircularProgress size={16} color="inherit" /> : <LogoutIcon />}
                            onClick={handleCheckOut}
                            disabled={checkOutLoading}
                            sx={{
                              bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' },
                              fontWeight: 700, borderRadius: 2,
                            }}
                          >
                            Check Out
                          </Button>
                        )}
                        {isCheckedOut && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Shift Complete"
                            sx={{ bgcolor: '#10B981', color: 'white', fontWeight: 700 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Leave Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" fontWeight={700}>Quick Actions</Typography>
              <Button
                fullWidth variant="contained" startIcon={<EventNoteIcon />}
                onClick={() => navigate(ROUTES.LEAVE_APPLY)}
                sx={{ py: 1.5, background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)' }}
              >
                Apply for Leave
              </Button>
              <Button
                fullWidth variant="outlined" startIcon={<AccessTimeIcon />}
                onClick={() => navigate(ROUTES.ATTENDANCE_HISTORY)}
              >
                View Attendance
              </Button>
              <Button
                fullWidth variant="outlined" color="secondary" startIcon={<EventNoteIcon />}
                onClick={() => navigate(ROUTES.LEAVE_HISTORY)}
              >
                Leave History
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- STATS CARDS ---- */}
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Casual Leave"
            value={balance?.casualLeave ?? '—'}
            subtitle="days remaining"
            icon={BeachAccessIcon}
            color="info"
            loading={leaveLoading}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Medical Leave"
            value={balance?.medicalLeave ?? '—'}
            subtitle="days remaining"
            icon={LocalHospitalIcon}
            color="error"
            loading={leaveLoading}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Paid Leave"
            value={balance?.paidLeave ?? '—'}
            subtitle="days remaining"
            icon={AttachMoneyIcon}
            color="success"
            loading={leaveLoading}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Pending"
            value={pendingLeaves}
            subtitle="leave requests"
            icon={HourglassEmptyIcon}
            color="warning"
            loading={leaveLoading}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Approved"
            value={approvedLeaves}
            subtitle="leaves this year"
            icon={CheckCircleIcon}
            color="success"
            loading={leaveLoading}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatsCard
            title="Rejected"
            value={rejectedLeaves}
            subtitle="leave requests"
            icon={CancelIcon}
            color="error"
            loading={leaveLoading}
          />
        </Grid>

        {/* ---- ATTENDANCE TREND CHART ---- */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Attendance Trend (Last 7 Days)
              </Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrendData}>
                    <defs>
                      <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 10]} />
                    <Tooltip
                      formatter={(v) => [`${v}h`, 'Hours']}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hours"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fill="url(#hoursGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ---- LEAVE DISTRIBUTION PIE ---- */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Leave Balance
              </Typography>
              {leaveLoading ? (
                <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leavePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {leavePieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(v) => <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ---- RECENT LEAVE ACTIVITY ---- */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Recent Leave Requests</Typography>
                <Button size="small" onClick={() => navigate(ROUTES.LEAVE_HISTORY)}>View All</Button>
              </Box>

              {leaveLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[1, 2, 3].map(i => <Skeleton key={i} height={60} sx={{ borderRadius: 2 }} />)}
                </Box>
              ) : recentLeaves.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventNoteIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No leave requests yet</Typography>
                  <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(ROUTES.LEAVE_APPLY)}>
                    Apply for Leave
                  </Button>
                </Box>
              ) : (
                <List disablePadding>
                  {recentLeaves.map((leave, i) => (
                    <React.Fragment key={leave.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon>
                          <Box sx={{
                            width: 40, height: 40, borderRadius: 2,
                            bgcolor: 'primary.main', opacity: 0.1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <EventNoteIcon color="primary" fontSize="small" />
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {leave.leaveType} Leave
                              </Typography>
                              <StatusChip status={leave.status} />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
                              {`${formatDate(leave.startDate)} → ${formatDate(leave.endDate)} • ${leave.reason}`}
                            </Typography>
                          }
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                          {formatDate(leave.createdAt)}
                        </Typography>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;
