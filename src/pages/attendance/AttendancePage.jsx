import React, { useEffect, useState } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Chip, Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayRecord, checkIn, checkOut } from '../../redux/slices/attendanceSlice';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/common/StatsCard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimerIcon from '@mui/icons-material/Timer';
import { formatDateTime, formatTime, formatHours } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const AttendancePage = () => {
  const dispatch = useDispatch();
  const { today, loading, checkInLoading, checkOutLoading } = useSelector(state => state.attendance);
  const [liveTime, setLiveTime] = useState(dayjs());
  const [workingSeconds, setWorkingSeconds] = useState(0);

  useEffect(() => {
    dispatch(fetchTodayRecord());
  }, [dispatch]);

  // Keep live time and elapsed timer running
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(dayjs());
      if (today?.checkIn && !today?.checkOut) {
        const diff = dayjs().diff(dayjs(today.checkIn), 'second');
        setWorkingSeconds(diff);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [today]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (checkIn.fulfilled.match(result)) {
      toast.success('Successfully checked in!');
      if (result.payload?.late) {
        toast.warning('Marked as Late Check-In (After 09:15 AM)');
      }
    } else {
      toast.error(result.payload || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.fulfilled.match(result)) {
      toast.success(`Successfully checked out! Working hours recorded: ${result.payload.workingHours}`);
    } else {
      toast.error(result.payload || 'Check-out failed');
    }
  };

  const formatElapsedTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const hasCheckedIn = !!today?.checkIn;
  const hasCheckedOut = !!today?.checkOut;

  return (
    <Box>
      <PageHeader
        title="Shift Check-In & Attendance"
        subtitle="Manage daily shifts, clock check-ins/outs and track shift durations"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance' }]}
      />

      <Grid container spacing={3}>
        {/* Live clock check-in station */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 2, textTransform: 'uppercase', mb: 1 }}>
                Live System Clock
              </Typography>
              <Typography variant="h2" fontWeight={800} sx={{ fontFamily: 'monospace', mb: 2, color: 'primary.main' }}>
                {liveTime.format('HH:mm:ss')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {liveTime.format('dddd, MMMM D, YYYY')}
              </Typography>

              <Stack direction="row" spacing={2}>
                {!hasCheckedIn && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={checkInLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                    onClick={handleCheckIn}
                    disabled={checkInLoading}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Check In
                  </Button>
                )}

                {hasCheckedIn && !hasCheckedOut && (
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={checkOutLoading ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                    onClick={handleCheckOut}
                    disabled={checkOutLoading}
                    sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Check Out
                  </Button>
                )}

                {hasCheckedOut && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    color="success"
                    label="Today's Shift Finished"
                    sx={{ py: 2.5, px: 2, borderRadius: 3, fontWeight: 700, fontSize: '1rem' }}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Shift detail cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Shift Status
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Check-In Time:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {today?.checkIn ? formatDateTime(today.checkIn) : 'Not Checked In'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Check-Out Time:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {today?.checkOut ? formatDateTime(today.checkOut) : 'Not Checked Out'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Shift Duration:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {today?.workingHours ? `${today.workingHours} Hours` : hasCheckedIn && !hasCheckedOut ? formatElapsedTime(workingSeconds) : '—'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Arrival Status:</Typography>
                      <Box>
                        {hasCheckedIn ? (
                          today?.late ? (
                            <Chip size="small" color="warning" icon={<WarningAmberIcon />} label="Late Check-In" />
                          ) : (
                            <Chip size="small" color="success" icon={<CheckCircleIcon />} label="On Time" />
                          )
                        ) : (
                          <Typography variant="body2" fontWeight={600}>—</Typography>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendancePage;
