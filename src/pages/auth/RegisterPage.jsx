import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  MenuItem, Alert, CircularProgress, InputAdornment, Grid,
  Divider, Select, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { registerUser, fetchManagers, clearError, clearRegisterSuccess } from '../../redux/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/leaveTypes';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import WorkIcon from '@mui/icons-material/Work';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Min 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
  role: yup.string().required('Role is required').oneOf(Object.values(ROLES)),
  managerId: yup.number().nullable().transform((v, o) => o === '' ? null : v)
    .when('role', {
      is: ROLES.EMPLOYEE,
      then: (s) => s.required('Manager is required for employees').typeError('Select a manager'),
      otherwise: (s) => s.nullable(),
    }),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, managers, managersLoading, registerSuccess } = useSelector(state => state.auth);

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { username: '', email: '', password: '', role: '', managerId: '' },
  });

  const selectedRole = watch('role');

  useEffect(() => {
    dispatch(fetchManagers());
    return () => { dispatch(clearError()); dispatch(clearRegisterSuccess()); };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      toast.error(msg);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      toast.success('Registration successful! Awaiting admin approval before you can login.');
      navigate(ROUTES.LOGIN);
    }
  }, [registerSuccess, navigate]);

  const onSubmit = (data) => {
    const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
      managerId: data.role === ROLES.EMPLOYEE ? Number(data.managerId) : null,
    };
    dispatch(registerUser(payload));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 100%)',
        py: 4,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 520, zIndex: 1 }}
      >
        <Card sx={{ borderRadius: 4, boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <WorkIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800}>Create Account</Typography>
                <Typography variant="caption" color="text.secondary">TechNova HRMS Portal</Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              After registration, your account requires <strong>Admin approval</strong> before login.
            </Alert>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name / Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment>,
                      }
                    }}
                    {...register('username')}
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>,
                      }
                    }}
                    {...register('email')}
                  />
                </Grid>

                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>,
                      }
                    }}
                    {...register('password')}
                  />
                </Grid>

                <Grid xs={12}>
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Role">
                          <MenuItem value={ROLES.EMPLOYEE}>Employee</MenuItem>
                          <MenuItem value={ROLES.MANAGER}>Manager</MenuItem>
                          <MenuItem value={ROLES.HR}>HR</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                  </FormControl>
                </Grid>

                {selectedRole === ROLES.EMPLOYEE && (
                  <Grid xs={12}>
                    <FormControl fullWidth error={!!errors.managerId}>
                      <InputLabel>Reporting Manager *</InputLabel>
                      <Controller
                        name="managerId"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} label="Reporting Manager *">
                            {managersLoading ? (
                              <MenuItem disabled>Loading managers...</MenuItem>
                            ) : managers.length === 0 ? (
                              <MenuItem disabled>No managers available</MenuItem>
                            ) : (
                              managers.map(m => (
                                <MenuItem key={m.id} value={m.id}>
                                  {m.username} — {m.email}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        )}
                      />
                      {errors.managerId && <FormHelperText>{errors.managerId.message}</FormHelperText>}
                    </FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Managers or HR cannot have a reporting manager.
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3, py: 1.5, fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Typography component={Link} to={ROUTES.LOGIN} variant="body2" color="primary" fontWeight={700} sx={{ textDecoration: 'none' }}>
                    Sign In
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default RegisterPage;
