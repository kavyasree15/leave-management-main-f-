import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Stack, Grid,
  CircularProgress, Alert, ButtonBase, Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { fetchCurrentUser } from '../../redux/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';

const KycPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const userId = user?.userId || user?.id;  // normalize: login returns userId, profile fetch returns id

  // Form states
  const [fullName, setFullName] = useState(user?.username || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');

  // Files
  const [panCard, setPanCard] = useState(null);
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [passport, setPassport] = useState(null);
  const [drivingLicense, setDrivingLicense] = useState(null);

  // Status/loading
  const [loading, setLoading] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);

  useEffect(() => {
    // Periodically fetch profile details to see if approval/status has updated
    if (userId) {
      dispatch(fetchCurrentUser(userId));
    }
  }, [dispatch, userId]);

  // Redirect to dashboard if approved
  useEffect(() => {
    if (user?.kycStatus === 'APPROVED') {
      toast.success("Your KYC is approved! Redirecting...");
      navigate(ROUTES.DASHBOARD);
    }
  }, [user?.kycStatus, navigate]);

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should not exceed 5MB");
        return;
      }
      setter(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !mobileNumber || !dob || !gender || !address || !panNumber || !aadhaarNumber) {
      toast.error("Please fill in all details");
      return;
    }
    if (!panCard || !aadhaarCard) {
      toast.error("PAN Card and Aadhaar Card uploads are required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("mobileNumber", mobileNumber);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("panNumber", panNumber);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("panCard", panCard);
    formData.append("aadhaarCard", aadhaarCard);
    if (passport) formData.append("passport", passport);
    if (drivingLicense) formData.append("drivingLicense", drivingLicense);

    try {
      const res = await authService.submitKyc(userId, formData);
      toast.success("KYC Details submitted successfully!");
      dispatch(fetchCurrentUser(userId));
      setResubmitting(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data || "KYC submission failed");
    } finally {
      setLoading(false);
    }
  };

  const getFilePreview = (file) => {
    if (!file) return null;
    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">Document (PDF/Doc)</Typography>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>{file.name}</Typography>
      </Box>
    );
  };

  // Rendering logic based on KYC Status
  const kycStatus = resubmitting ? 'PENDING' : (user?.kycStatus || 'PENDING');

  if (kycStatus === 'PENDING_MANAGER') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6, pb: 8, px: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card sx={{ maxWidth: 650, borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Paper sx={{
                  width: 80, height: 80, borderRadius: '50%',
                  bgcolor: 'warning.light', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AccessTimeIcon sx={{ color: 'warning.main', fontSize: 44 }} />
                </Paper>
              </Box>

              <Typography variant="h4" fontWeight={800} gutterBottom>
                KYC Verification Pending
              </Typography>
              <Typography color="text.secondary" paragraph sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                Your KYC submission is completed. HR will assign your Manager to complete the verification review. 
                Please wait while we set up your portal access.
              </Typography>

              <Alert severity="info" sx={{ textAlign: 'left', borderRadius: 3, mb: 4 }}>
                <strong>Current Status:</strong> Pending Manager Review.<br />
                Your account is currently restricted. Attendance and Leave functionalities will become active once your documents are approved.
              </Alert>

              <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 3, textAlign: 'left', mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>SUBMITTED INFORMATION</Typography>
                <Grid container spacing={2}>
                  <Grid xs={6}><Typography variant="body2"><strong>Full Name:</strong> {user?.username}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Email:</strong> {user?.email}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>Mobile:</strong> {user?.mobileNumber || 'N/A'}</Typography></Grid>
                  <Grid xs={6}><Typography variant="body2"><strong>D.O.B:</strong> {user?.dob || 'N/A'}</Typography></Grid>
                </Grid>
              </Box>

              <Button
                variant="outlined"
              onClick={() => dispatch(fetchCurrentUser(userId))}
                sx={{ borderRadius: 2.5, textTransform: 'none', px: 4, fontWeight: 700 }}
              >
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }

  if (kycStatus === 'REJECTED') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6, pb: 8, px: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card sx={{ maxWidth: 600, borderRadius: 4, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Paper sx={{
                  width: 80, height: 80, borderRadius: '50%',
                  bgcolor: 'error.light', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CancelIcon sx={{ color: 'error.main', fontSize: 44 }} />
                </Paper>
              </Box>

              <Typography variant="h4" fontWeight={800} color="error" gutterBottom>
                KYC Verification Rejected
              </Typography>
              <Typography color="text.secondary" paragraph sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
                Unfortunately, your submitted KYC documents did not meet verification criteria. 
                Please contact your Manager or HR for further assistance.
              </Typography>

              {user?.rejectionReason && (
                <Alert severity="error" sx={{ textAlign: 'left', borderRadius: 3, mb: 4 }}>
                  <strong>Rejection Reason:</strong> {user.rejectionReason}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={() => setResubmitting(true)}
                sx={{
                  borderRadius: 2.5, textTransform: 'none', px: 5, py: 1.2, fontWeight: 700,
                  bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' }
                }}
              >
                Resubmit KYC Form
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }

  // Else, show Form
  return (
    <Box sx={{ py: 3 }}>
      <PageHeader
        title="Employee KYC Verification"
        subtitle="Complete your profile documentation to activate your system access"
        breadcrumbs={[{ label: 'KYC Onboarding' }]}
      />

      <Alert severity="warning" sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}>
        Please complete your KYC verification before accessing the system.
      </Alert>

      <Grid container spacing={3}>
        <Grid xs={12} lg={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom mb={3}>Personal Details</Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Full Name (As on Government ID)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      size="small"
                      fullWidth
                      required
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={gender}
                        label="Gender"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12}>
                    <TextField
                      label="Residential Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      size="small"
                      fullWidth
                      multiline
                      rows={3}
                      required
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>Government Identification</Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="PAN Card Number"
                      placeholder="ABCDE1234F"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid xs={12} md={6}>
                    <TextField
                      label="Aadhaar Card Number"
                      placeholder="123456789012"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                      size="small"
                      fullWidth
                      required
                      slotProps={{ htmlInput: { maxLength: 12 } }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mt: 1 }}>Required Documents (Max 5MB per file)</Typography>
                <Grid container spacing={2}>
                  {/* PAN Card */}
                  <Grid xs={12} sm={6}>
                    <Box sx={{ border: '1.5px dashed #ccc', borderRadius: 3, p: 2, textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                      {panCard ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          {getFilePreview(panCard)}
                          <Button size="small" variant="contained" color="error" onClick={() => setPanCard(null)} sx={{ position: 'absolute', bottom: 8, right: 8, textTransform: 'none' }}>Change</Button>
                        </Box>
                      ) : (
                        <>
                          <CloudUploadIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                          <Typography variant="body2" fontWeight={600}>Upload PAN Card *</Typography>
                          <input type="file" onChange={handleFileChange(setPanCard)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} accept=".pdf,image/*" />
                        </>
                      )}
                    </Box>
                  </Grid>

                  {/* Aadhaar Card */}
                  <Grid xs={12} sm={6}>
                    <Box sx={{ border: '1.5px dashed #ccc', borderRadius: 3, p: 2, textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                      {aadhaarCard ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          {getFilePreview(aadhaarCard)}
                          <Button size="small" variant="contained" color="error" onClick={() => setAadhaarCard(null)} sx={{ position: 'absolute', bottom: 8, right: 8, textTransform: 'none' }}>Change</Button>
                        </Box>
                      ) : (
                        <>
                          <CloudUploadIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                          <Typography variant="body2" fontWeight={600}>Upload Aadhaar Card *</Typography>
                          <input type="file" onChange={handleFileChange(setAadhaarCard)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} accept=".pdf,image/*" />
                        </>
                      )}
                    </Box>
                  </Grid>

                  {/* Passport */}
                  <Grid xs={12} sm={6}>
                    <Box sx={{ border: '1.5px dashed #ccc', borderRadius: 3, p: 2, textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                      {passport ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          {getFilePreview(passport)}
                          <Button size="small" variant="contained" color="error" onClick={() => setPassport(null)} sx={{ position: 'absolute', bottom: 8, right: 8, textTransform: 'none' }}>Change</Button>
                        </Box>
                      ) : (
                        <>
                          <CloudUploadIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                          <Typography variant="body2" fontWeight={600}>Upload Passport (Optional)</Typography>
                          <input type="file" onChange={handleFileChange(setPassport)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} accept=".pdf,image/*" />
                        </>
                      )}
                    </Box>
                  </Grid>

                  {/* Driving License */}
                  <Grid xs={12} sm={6}>
                    <Box sx={{ border: '1.5px dashed #ccc', borderRadius: 3, p: 2, textAlign: 'center', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                      {drivingLicense ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                          {getFilePreview(drivingLicense)}
                          <Button size="small" variant="contained" color="error" onClick={() => setDrivingLicense(null)} sx={{ position: 'absolute', bottom: 8, right: 8, textTransform: 'none' }}>Change</Button>
                        </Box>
                      ) : (
                        <>
                          <CloudUploadIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                          <Typography variant="body2" fontWeight={600}>Upload Driving License (Optional)</Typography>
                          <input type="file" onChange={handleFileChange(setDrivingLicense)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} accept=".pdf,image/*" />
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2, py: 1.5, borderRadius: 2.5, fontWeight: 700,
                    background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                    '&:hover': { background: '#1E1B4B' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit KYC Documents'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} lg={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom mb={2.5}>Why is KYC required?</Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>Security & Verification</Typography>
                  <Typography variant="body2" color="text.secondary">We must verify all employees before granting access to company servers and attendance databases.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>Statutory Compliances</Typography>
                  <Typography variant="body2" color="text.secondary">Submission of valid PAN and Aadhaar records ensures appropriate tax computations and PF bindings.</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>Manager Assignment</Typography>
                  <Typography variant="body2" color="text.secondary">Once submitted, your assigned HR officer will allocate your reporting manager to activate your dashboard.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KycPage;
