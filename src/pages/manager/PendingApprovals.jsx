import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Divider, CircularProgress,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Stack, Chip, Alert,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests, approveLeave, rejectLeave, clearLeaveError } from '../../redux/slices/leaveSlice';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const PendingApprovals = () => {
  const dispatch = useDispatch();
  const { pendingRequests, loading, actionLoading, error } = useSelector(state => state.leave);
  const { user } = useSelector(state => state.auth);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null); // { id, action: 'approve' | 'reject' }

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : (error?.message || 'Failed to update leave request');
      toast.error(`⚠️ ${msg}`);
      dispatch(clearLeaveError());
    }
  }, [error, dispatch]);

  const handleOpenConfirm = (id, action) => {
    setSelectedAction({ id, action });
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedAction(null);
    setConfirmOpen(false);
  };

  const handleAction = async () => {
    if (!selectedAction) return;
    const { id, action } = selectedAction;
    let result;
    if (action === 'approve') {
      result = await dispatch(approveLeave(id));
      if (approveLeave.fulfilled.match(result)) toast.success('Approved leave request');
    } else {
      result = await dispatch(rejectLeave(id));
      if (rejectLeave.fulfilled.match(result)) toast.error('Rejected leave request');
    }
    handleCloseConfirm();
  };

  return (
    <Box>
      <PageHeader
        title={user?.role === 'HR' ? 'Pending HR Approvals' : 'Pending Leave Approvals'}
        subtitle={user?.role === 'HR'
          ? 'Review leave requests from employees (long-duration) and managers — all requiring HR sign-off'
          : 'Manage, review, approve or reject leave requests submitted by your team employees'}
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Pending Approvals' }]}
      />

      <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>No Self-Approval Rule:</strong> Approving managers and HR admins are barred from validating or rejecting their own leave requests.
      </Alert>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : pendingRequests.length === 0 ? (
        <EmptyState
          icon={PendingActionsIcon}
          title="All Caught Up!"
          description="There are currently no pending leave requests awaiting approval."
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendingRequests.map((req) => (
            <Card key={req.id} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid xs={12} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                        {req.userId.toString().charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          Employee ID: #{req.userId}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {req.leaveType} Leave
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Duration:</strong> {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Reason:</strong> {req.reason}
                    </Typography>
                    {req.medicalCertificate && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const newTab = window.open();
                            newTab.document.write(
                              `<iframe src="${req.medicalCertificate}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                            );
                          }}
                        >
                          View Uploaded Certificate
                        </Button>
                      </Box>
                    )}
                  </Grid>

                  <Grid xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleOpenConfirm(req.id, 'approve')}
                      disabled={actionLoading}
                      sx={{ borderRadius: 2 }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleOpenConfirm(req.id, 'reject')}
                      disabled={actionLoading}
                      sx={{ borderRadius: 2 }}
                    >
                      Reject
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Approve/Reject Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={selectedAction?.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        message={
          selectedAction?.action === 'approve'
            ? 'Are you sure you want to approve this leave request?'
            : 'Are you sure you want to reject this leave request?'
        }
        confirmText={selectedAction?.action === 'approve' ? 'Approve' : 'Reject'}
        confirmColor={selectedAction?.action === 'approve' ? 'success' : 'error'}
        onConfirm={handleAction}
        onCancel={handleCloseConfirm}
        loading={actionLoading}
      />
    </Box>
  );
};

export default PendingApprovals;
