import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import hrService from '../../services/hrService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import BarChartIcon from '@mui/icons-material/BarChart';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const AttendanceReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Start Date and End Date are required');
      return;
    }

    setLoading(true);
    try {
      const uid = userIdFilter ? Number(userIdFilter) : null;
      const res = await hrService.getAttendanceReport(startDate, endDate, uid);
      setRecords(res.data || []);
      toast.success('Attendance report generated');
    } catch (err) {
      toast.error(err.response?.data || 'Failed to generate report');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Attendance Reports Console"
        subtitle="Extract aggregate shift hours and late parameters for payroll reconciliation"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/hr/analytics' }, { label: 'Attendance Report' }]}
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleFetchReport}>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Employee ID (Optional)"
                  type="number"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{ height: 40, borderRadius: 2 }}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : records.length === 0 ? (
            <EmptyState
              icon={BarChartIcon}
              title="No Report Data"
              description="Fill out date parameters above to load attendance aggregates."
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Days Checked-In</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Late Arrivals Flagged</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Hours Worked</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Average Shift Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>#{row.userId}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.username}</TableCell>
                      <TableCell>{row.totalDays} Days</TableCell>
                      <TableCell sx={{ color: row.lateCount > 0 ? 'warning.main' : 'inherit', fontWeight: row.lateCount > 0 ? 600 : 400 }}>
                        {row.lateCount} Shifts
                      </TableCell>
                      <TableCell>{row.totalHours} Hours</TableCell>
                      <TableCell>{row.avgHours} Hours</TableCell>
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

export default AttendanceReport;
