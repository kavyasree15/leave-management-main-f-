import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Divider, CircularProgress,
  Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';

const AdminApprovals = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector(state => state.auth);

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const pendingApprovals = users.filter(u => u.role === 'EMPLOYEE' && u.kycStatus === 'PENDING_MANAGER');

  const handleApproveKyc = async (userId) => {
    setSubmitting(true);
    try {
      await authService.approveKyc(userId);
      toast.success("Employee KYC approved successfully!");
      setReviewOpen(false);
      setSelectedEmp(null);
      dispatch(fetchAllUsers());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve KYC");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectKyc = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setSubmitting(true);
    try {
      await authService.rejectKyc(selectedEmp.id, rejectionReason);
      toast.success("Employee KYC verification rejected.");
      setRejectOpen(false);
      setReviewOpen(false);
      setSelectedEmp(null);
      setRejectionReason('');
      dispatch(fetchAllUsers());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject KYC");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Pending KYC Approvals"
        subtitle="Review employee government details and document uploads to activate accounts"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Approvals' }]}
      />

      {usersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : pendingApprovals.length === 0 ? (
        <EmptyState
          icon={HowToRegIcon}
          title="All Submissions Handled"
          description="There are currently no employee KYC submissions pending verification."
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {pendingApprovals.map((u) => (
            <Card key={u.id} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{u.username}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                    Aadhar: {u.aadhaarNumber || 'N/A'} | PAN: {u.panNumber || 'N/A'}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedEmp(u);
                    setReviewOpen(true);
                  }}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Review Details & Documents
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* KYC Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Review KYC: {selectedEmp?.username}</DialogTitle>
        <DialogContent>
          {selectedEmp && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid xs={6}><Typography variant="body2"><strong>Full Name:</strong> {selectedEmp.username}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>Email:</strong> {selectedEmp.email}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>Mobile:</strong> {selectedEmp.mobileNumber || 'N/A'}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>D.O.B:</strong> {selectedEmp.dob || 'N/A'}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>Gender:</strong> {selectedEmp.gender || 'N/A'}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>Address:</strong> {selectedEmp.address || 'N/A'}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>PAN Number:</strong> {selectedEmp.panNumber || 'N/A'}</Typography></Grid>
                <Grid xs={6}><Typography variant="body2"><strong>Aadhaar Number:</strong> {selectedEmp.aadhaarNumber || 'N/A'}</Typography></Grid>
              </Grid>

              <Divider />
              <Typography variant="subtitle2" fontWeight={700}>Uploaded Documents</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedEmp.panCardUrl && (
                  <Button variant="outlined" component="a" href={`http://localhost:8080${selectedEmp.panCardUrl}`} target="_blank" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    PAN Card Document
                  </Button>
                )}
                {selectedEmp.aadhaarCardUrl && (
                  <Button variant="outlined" component="a" href={`http://localhost:8080${selectedEmp.aadhaarCardUrl}`} target="_blank" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Aadhaar Card Document
                  </Button>
                )}
                {selectedEmp.passportUrl && (
                  <Button variant="outlined" component="a" href={`http://localhost:8080${selectedEmp.passportUrl}`} target="_blank" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Passport Document
                  </Button>
                )}
                {selectedEmp.drivingLicenseUrl && (
                  <Button variant="outlined" component="a" href={`http://localhost:8080${selectedEmp.drivingLicenseUrl}`} target="_blank" size="small" sx={{ textTransform: 'none', borderRadius: 2 }}>
                    Driving License
                  </Button>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)} color="inherit" disabled={submitting}>Close</Button>
          <Button onClick={() => setRejectOpen(true)} color="error" variant="outlined" disabled={submitting}>Reject KYC</Button>
          <Button onClick={() => handleApproveKyc(selectedEmp.id)} color="success" variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Approve KYC'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* KYC Rejection Reason Dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject KYC Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please provide a specific reason for rejecting <strong>{selectedEmp?.username}</strong>'s KYC request. 
            This will be visible on the employee's dashboard.
          </Typography>
          <TextField
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
            sx={{ mt: 1 }}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)} color="inherit" disabled={submitting}>Cancel</Button>
          <Button onClick={handleRejectKyc} color="error" variant="contained" disabled={!rejectionReason || submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Reject KYC'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminApprovals;
