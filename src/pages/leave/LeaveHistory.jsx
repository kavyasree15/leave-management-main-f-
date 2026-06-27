import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves, fetchMyBalance, cancelLeave, clearLeaveError } from '../../redux/slices/leaveSlice';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/common/StatsCard';
import StatusChip from '../../components/common/StatusChip';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelIcon from '@mui/icons-material/Cancel';

const LeaveHistory = () => {
  const dispatch = useDispatch();
  const { myLeaves, balance, loading, actionLoading, error } = useSelector(state => state.leave);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    dispatch(fetchMyLeaves());
    dispatch(fetchMyBalance());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : (error?.message || 'Failed to perform action');
      toast.error(`⚠️ ${msg}`);
      dispatch(clearLeaveError());
    }
  }, [error, dispatch]);

  const handleOpenCancel = (leave) => {
    setSelectedLeave(leave);
    setCancelOpen(true);
  };

  const handleCloseCancel = () => {
    setSelectedLeave(null);
    setCancelOpen(false);
  };

  const handleCancel = async () => {
    if (!selectedLeave) return;
    const result = await dispatch(cancelLeave(selectedLeave.id));
    if (cancelLeave.fulfilled.match(result)) {
      toast.success('Successfully cancelled leave request. Balance restored.');
      dispatch(fetchMyBalance()); // refresh balances
    }
    handleCloseCancel();
  };

  const activeLeaves = myLeaves.filter(l => l.status === 'APPROVED');
  const pendingLeaves = myLeaves.filter(l => l.status === 'PENDING_MANAGER' || l.status === 'PENDING_HR');

  return (
    <Box>
      <PageHeader
        title="My Leave History"
        subtitle="Manage and track the approvals timeline of your leave applications"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Leave History' }]}
      />

      {/* Balance stats display */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard title="Casual Leave Balance" value={balance?.casualLeave} icon={BeachAccessIcon} color="info" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard title="Medical Leave Balance" value={balance?.medicalLeave} icon={LocalHospitalIcon} color="error" loading={loading} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard title="Paid Leave Balance" value={balance?.paidLeave} icon={AttachMoneyIcon} color="success" loading={loading} />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : myLeaves.length === 0 ? (
            <EmptyState
              icon={BeachAccessIcon}
              title="No Leave History"
              description="You have not submitted any leave requests yet."
            />
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Requested On</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {myLeaves.map((row) => {
                    const canCancel = row.status !== 'CANCELLED' && row.status !== 'REJECTED';
                    return (
                      <TableRow key={row.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.leaveType}</TableCell>
                        <TableCell>{formatDate(row.startDate)}</TableCell>
                        <TableCell>{formatDate(row.endDate)}</TableCell>
                        <TableCell>{row.reason}</TableCell>
                        <TableCell><StatusChip status={row.status} /></TableCell>
                        <TableCell>{formatDate(row.createdAt)}</TableCell>
                        <TableCell>
                          {canCancel && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleOpenCancel(row)}
                              sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request? If approved, your leave balances will be restored automatically."
        confirmText="Cancel Leave"
        confirmColor="error"
        onConfirm={handleCancel}
        onCancel={handleCloseCancel}
        loading={actionLoading}
      />
    </Box>
  );
};

export default LeaveHistory;
