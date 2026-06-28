import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';
import hrService from '../../services/hrService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import TimelineIcon from '@mui/icons-material/Timeline';
import { toast } from 'react-toastify';

const LeaveReport = () => {
  const [userIdFilter, setUserIdFilter] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uid = userIdFilter ? Number(userIdFilter) : null;
      const res = await hrService.getLeaveReport(uid);
      setRecords(res.data || []);
      toast.success('Leave utilization report generated');
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
        title="Leave Utilization Reports Console"
        subtitle="Audit accruals balances and totals of taken leave slots across the organization"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/hr/analytics' }, { label: 'Leave Report' }]}
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleFetchReport}>
            <Grid container spacing={2} sx={{ alignItems: 'center' }}>
              <Grid xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Employee ID (Optional)"
                  type="number"
                  placeholder="Leave empty to generate report for all registered users"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid xs={12} sm={4}>
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
              icon={TimelineIcon}
              title="No Report Data"
              description="Click generate report above to pull leave utilization metrics."
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Employee Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Casual Taken / Bal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Medical Taken / Bal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Paid Taken / Bal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Unpaid Taken</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((row) => (
                    <TableRow key={row.userId}>
                      <TableCell>#{row.userId}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.username}</TableCell>
                      <TableCell>{row.casualTaken} / {row.casualRemaining} days</TableCell>
                      <TableCell>{row.medicalTaken} / {row.medicalRemaining} days</TableCell>
                      <TableCell>{row.paidTaken} / {row.paidRemaining} days</TableCell>
                      <TableCell>{row.unpaidTaken} days</TableCell>
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

export default LeaveReport;
