import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, CircularProgress,
  TextField, Button, Grid, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserHistory } from '../../redux/slices/attendanceSlice';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatDate, formatTime } from '../../utils/dateUtils';
import dayjs from 'dayjs';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector(state => state.attendance);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchUserHistory());
  }, [dispatch]);

  const filteredHistory = history.filter(record => {
    if (!startDate && !endDate) return true;
    const recordDate = dayjs(record.date);
    const start = startDate ? dayjs(startDate) : null;
    const end = endDate ? dayjs(endDate) : null;

    if (start && recordDate.isBefore(start, 'day')) return false;
    if (end && recordDate.isAfter(end, 'day')) return false;
    return true;
  });

  return (
    <Box>
      <PageHeader
        title="Attendance Logs"
        subtitle="View and filter your complete attendance history"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance History' }]}
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={() => { setStartDate(''); setEndDate(''); }}
                size="small"
                sx={{ height: 40 }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredHistory.length === 0 ? (
            <EmptyState
              icon={AccessTimeIcon}
              title="No Attendance Logs Found"
              description="No attendance shifts match your specified date filters."
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Check In</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Check Out</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Shift Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Arrival Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell>{formatTime(row.checkIn)}</TableCell>
                      <TableCell>{row.checkOut ? formatTime(row.checkOut) : '—'}</TableCell>
                      <TableCell>{row.workingHours ? `${row.workingHours} Hours` : '—'}</TableCell>
                      <TableCell>
                        {row.late ? (
                          <Chip size="small" color="warning" icon={<WarningAmberIcon fontSize="small" />} label="Late Check-In" sx={{ fontWeight: 600 }} />
                        ) : (
                          <Chip size="small" color="success" icon={<CheckCircleIcon fontSize="small" />} label="On Time" sx={{ fontWeight: 600 }} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

// Simple Chip wrapper for table cell status
const Chip = ({ size, color, icon, label, sx }) => (
  <Box sx={{
    display: 'inline-flex', alignItems: 'center', gap: 0.5,
    px: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.75rem',
    bgcolor: color === 'success' ? '#D1FAE5' : '#FEF3C7',
    color: color === 'success' ? '#065F46' : '#92400E',
    fontWeight: 600, ...sx
  }}>
    {icon}
    {label}
  </Box>
);

export default AttendanceHistory;
