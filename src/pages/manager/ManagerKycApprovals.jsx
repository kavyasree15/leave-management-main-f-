import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Divider, CircularProgress,
  Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, Chip
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BadgeIcon from '@mui/icons-material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';

const ManagerKycApprovals = () => {
  const { user } = useSelector(state => state.auth);
  const managerId = user?.userId || user?.id;

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPendingKyc = async () => {
    setLoading(true);
    try {
      const res = await authService.getManagerPendingKyc();
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load pending KYC submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKyc();
  }, []);

  const handleApprove = async (userId) => {
    setSubmitting(true);
    try {
      await authService.approveKyc(userId);
      toast.success('KYC approved! Employee account is now active.');
      setReviewOpen(false);
      setSelectedEmp(null);
      fetchPendingKyc();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve KYC');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setSubmitting(true);
    try {
      await authService.rejectKyc(selectedEmp.id, rejectionReason);
      toast.success('KYC rejected. Employee has been notified.');
      setRejectOpen(false);
      setReviewOpen(false);
      setSelectedEmp(null);
      setRejectionReason('');
      fetchPendingKyc();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject KYC');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="KYC Approvals"
        subtitle="Review your team members' KYC documents and activate their accounts"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'KYC Approvals' }]}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : employees.length === 0 ? (
        <EmptyState
          icon={CheckCircleIcon}
          title="No Pending KYC Reviews"
          description="All your team members' KYC submissions have been processed. New submissions will appear here once HR assigns employees to you."
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Alert severity="info" sx={{ borderRadius: 3, mb: 1 }}>
            <strong>{employees.length} employee{employees.length > 1 ? 's' : ''}</strong> pending KYC verification.
            Review the submitted documents carefully before approving.
          </Alert>

          {employees.map((emp) => (
            <Card
              key={emp.id}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '50%',
                    bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {(emp.username || 'U').charAt(0).toUpperCase()}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{emp.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{emp.email}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip label={`PAN: ${emp.panNumber || 'N/A'}`} size="small" variant="outlined" />
                      <Chip label={`Aadhaar: ${emp.aadhaarNumber || 'N/A'}`} size="small" variant="outlined" />
                      <Chip label="KYC Pending" size="small" color="warning" />
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<BadgeIcon />}
                  onClick={() => { setSelectedEmp(emp); setReviewOpen(true); }}
                  sx={{
                    borderRadius: 2.5, textTransform: 'none', fontWeight: 600, px: 3,
                    background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                    '&:hover': { background: '#1E1B4B' }
                  }}
                >
                  Review KYC Documents
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          KYC Review: {selectedEmp?.username}
        </DialogTitle>
        <DialogContent>
          {selectedEmp && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              {/* Personal Details */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: 1 }}>
                  Personal Details
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid xs={6}><Typography variant="body2"><strong>Full Name:</strong> {selectedEmp.username}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Email:</strong> {selectedEmp.email}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Mobile:</strong> {selectedEmp.mobileNumber || 'N/A'}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>D.O.B:</strong> {selectedEmp.dob || 'N/A'}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Gender:</strong> {selectedEmp.gender || 'N/A'}</Typography></Grid>
                  <Grid xs={12}><Typography variant="body2"><strong>Address:</strong> {selectedEmp.address || 'N/A'}</Typography></Grid>
                </Grid>
              </Box>

              <Divider />

              {/* ID Numbers */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: 1 }}>
                  Government IDs
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid xs={6}><Typography variant="body2"><strong>PAN Number:</strong> {selectedEmp.panNumber || 'N/A'}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Aadhaar Number:</strong> {selectedEmp.aadhaarNumber || 'N/A'}</Typography></Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Documents */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1.5, textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: 1 }}>
                  Uploaded Documents
                </Typography>
                {!selectedEmp.panCardUrl && !selectedEmp.aadhaarCardUrl && !selectedEmp.passportUrl && !selectedEmp.drivingLicenseUrl ? (
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>No documents uploaded.</Alert>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {selectedEmp.panCardUrl && (
                      <Button variant="outlined" size="small" component="a"
                        href={`http://localhost:8080${selectedEmp.panCardUrl}`} target="_blank"
                        sx={{ textTransform: 'none', borderRadius: 2 }}>
                        PAN Card
                      </Button>
                    )}
                    {selectedEmp.aadhaarCardUrl && (
                      <Button variant="outlined" size="small" component="a"
                        href={`http://localhost:8080${selectedEmp.aadhaarCardUrl}`} target="_blank"
                        sx={{ textTransform: 'none', borderRadius: 2 }}>
                        Aadhaar Card
                      </Button>
                    )}
                    {selectedEmp.passportUrl && (
                      <Button variant="outlined" size="small" component="a"
                        href={`http://localhost:8080${selectedEmp.passportUrl}`} target="_blank"
                        sx={{ textTransform: 'none', borderRadius: 2 }}>
                        Passport
                      </Button>
                    )}
                    {selectedEmp.drivingLicenseUrl && (
                      <Button variant="outlined" size="small" component="a"
                        href={`http://localhost:8080${selectedEmp.drivingLicenseUrl}`} target="_blank"
                        sx={{ textTransform: 'none', borderRadius: 2 }}>
                        Driving License
                      </Button>
                    )}
                  </Stack>
                )}
              </Box>

              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                Approving this KYC will <strong>activate the employee's account</strong> and grant full portal access.
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setReviewOpen(false)} color="inherit" disabled={submitting}>Close</Button>
          <Button
            onClick={() => setRejectOpen(true)}
            color="error" variant="outlined" disabled={submitting}
            startIcon={<CancelIcon />}
          >
            Reject KYC
          </Button>
          <Button
            onClick={() => handleApprove(selectedEmp?.id)}
            color="success" variant="contained" disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
          >
            {submitting ? 'Processing...' : 'Approve KYC'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject KYC Submission</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide a reason for rejecting <strong>{selectedEmp?.username}</strong>'s KYC.
            This will be shown on their dashboard.
          </Typography>
          <TextField
            label="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline rows={3} fullWidth required
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setRejectOpen(false)} color="inherit" disabled={submitting}>Cancel</Button>
          <Button
            onClick={handleReject}
            color="error" variant="contained"
            disabled={!rejectionReason.trim() || submitting}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerKycApprovals;
