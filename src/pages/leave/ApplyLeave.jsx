import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Grid,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
  CircularProgress, Alert, Paper, Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchManagers } from '../../redux/slices/authSlice';
import { applyLeave, fetchMyBalance, clearApplySuccess, clearLeaveError } from '../../redux/slices/leaveSlice';
import PageHeader from '../../components/common/PageHeader';
import { LEAVE_TYPES } from '../../constants/leaveTypes';
import { calculateBusinessDays } from '../../utils/dateUtils';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const schema = yup.object({
  leaveType: yup.string().required('Leave type is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  reason: yup.string().required('Reason is required').min(10, 'Must be at least 10 characters'),
  managerId: yup.number().required('Manager selection is required').typeError('Select a manager'),
  medicalCertificate: yup.string().nullable(),
});

const ApplyLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { managers, managersLoading } = useSelector(state => state.auth);
  const { balance, actionLoading, applySuccess, error } = useSelector(state => state.leave);
  const [certBase64, setCertBase64] = useState(null);
  const [certName, setCertName] = useState('');

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { leaveType: '', startDate: '', endDate: '', reason: '', managerId: '', medicalCertificate: null }
  });

  const watchLeaveType = watch('leaveType');
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  useEffect(() => {
    dispatch(fetchManagers());
    dispatch(fetchMyBalance());
    return () => {
      dispatch(clearApplySuccess());
      dispatch(clearLeaveError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (applySuccess) {
      toast.success('🎉 Leave application submitted successfully!');
      navigate('/leave/history');
    }
  }, [applySuccess, navigate]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : (error?.message || 'Failed to apply leave');
      toast.error(`⚠️ ${msg}`);
      dispatch(clearLeaveError());
    }
  }, [error, dispatch]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setCertName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const businessDays = calculateBusinessDays(watchStartDate, watchEndDate);
  const isMedical = watchLeaveType === 'MEDICAL';
  // Certificate is required if medical leave is greater than 3 days
  const certRequired = isMedical && businessDays > 3;

  const onSubmit = (data) => {
    if (certRequired && !certBase64) {
      toast.error('Medical certificate is mandatory for medical leave exceeding 3 business days');
      return;
    }

    const payload = {
      startDate: data.startDate,
      endDate: data.endDate,
      leaveType: data.leaveType,
      reason: data.reason,
      managerId: Number(data.managerId),
      medicalCertificate: certBase64,
    };
    dispatch(applyLeave(payload));
  };

  return (
    <Box>
      <PageHeader
        title="Apply for Leave"
        subtitle="Submit a new leave request for manager approval"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Apply Leave' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  {/* Leave Type */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.leaveType}>
                      <InputLabel>Leave Type</InputLabel>
                      <Controller
                        name="leaveType"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} label="Leave Type">
                            {LEAVE_TYPES.map(t => (
                              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.leaveType && <FormHelperText>{errors.leaveType.message}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Manager */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.managerId}>
                      <InputLabel>Approving Manager</InputLabel>
                      <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} label="Approving Manager">
                            {managersLoading ? (
                              <MenuItem disabled>Loading managers...</MenuItem>
                            ) : managers.map(m => (
                              <MenuItem key={m.id} value={m.id}>{m.username} ({m.email})</MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.managerId && <FormHelperText>{errors.managerId.message}</FormHelperText>}
                    </FormControl>
                  </Grid>

                  {/* Start Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      slotProps={{ inputLabel: { shrink: true } }}
                      error={!!errors.startDate}
                      helperText={errors.startDate?.message}
                      {...register('startDate')}
                    />
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      slotProps={{ inputLabel: { shrink: true } }}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                      {...register('endDate')}
                    />
                  </Grid>

                  {/* Business Days Preview */}
                  {watchStartDate && watchEndDate && (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Calculated duration: <strong>{businessDays} Business Days</strong> (excluding weekends)
                      </Alert>
                    </Grid>
                  )}

                  {/* Certificate Upload */}
                  {isMedical && (
                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, borderStyle: certRequired ? 'dashed' : 'solid', borderColor: certRequired ? 'error.main' : 'divider' }}>
                        <Typography variant="subtitle2" fontWeight={700} color={certRequired ? 'error' : 'text.primary'} gutterBottom>
                          Medical Certificate {certRequired ? '(Required)' : '(Optional)'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          A medical certificate is mandatory if your medical leave exceeds 3 business days, or back-to-back medical leaves chain to exceed 3 days. Max file size: 2MB.
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUploadIcon />}
                          sx={{ borderRadius: 2 }}
                        >
                          Upload File
                          <input type="file" hidden accept="image/*,application/pdf" onChange={handleFileUpload} />
                        </Button>
                        {certName && (
                          <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 600, color: 'success.main' }}>
                            ✓ Selected: {certName}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  )}

                  {/* Reason */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reason / Comments"
                      multiline
                      rows={4}
                      error={!!errors.reason}
                      helperText={errors.reason?.message}
                      {...register('reason')}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={actionLoading}
                  sx={{
                    mt: 3, py: 1.25, px: 4, borderRadius: 2.5, fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)'
                  }}
                >
                  {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Balances display panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Leave Accruals</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Casual Leave Balance:</Typography>
                  <Typography variant="body2" fontWeight={700} color="info.main">{balance?.casualLeave ?? 12} Days</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Medical Leave Balance:</Typography>
                  <Typography variant="body2" fontWeight={700} color="error.main">{balance?.medicalLeave ?? 15} Days</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Paid Leave Balance:</Typography>
                  <Typography variant="body2" fontWeight={700} color="success.main">{balance?.paidLeave ?? 18} Days</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplyLeave;
