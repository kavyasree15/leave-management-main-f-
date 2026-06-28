import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Checkbox, FormControlLabel, Alert, CircularProgress,
  InputAdornment, IconButton, Divider
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WorkIcon from '@mui/icons-material/Work';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD);
    return () => { dispatch(clearError()); };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      const msg = typeof error === 'string' ? error : (error?.message || JSON.stringify(error));
      toast.error(msg);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    dispatch(loginUser({ credentials: data, rememberMe }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4C1D95 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background blobs */}
      <Box sx={{
        position: 'absolute', top: -80, right: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      {/* Left Branding Panel */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Box sx={{
              width: 80, height: 80, borderRadius: 4, mx: 'auto', mb: 3,
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
            }}>
              <WorkIcon sx={{ color: 'white', fontSize: 44 }} />
            </Box>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              TechNova HRMS
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7, fontWeight: 400, maxWidth: 380 }}>
              Enterprise Leave & Attendance Management Portal for 2,500+ employees
            </Typography>
          </Box>
        </motion.div>

        {/* Feature bullets */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { emoji: '✅', text: 'Real-time Check-In / Check-Out' },
              { emoji: '📋', text: 'Multi-tier Leave Approvals' },
              { emoji: '📊', text: 'HR Analytics & Reports' },
              { emoji: '🔒', text: 'Role-based Access Control' },
            ].map((f, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography fontSize={24}>{f.emoji}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>{f.text}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Right Login Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '480px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          bgcolor: { xs: 'transparent', lg: 'background.paper' },
          boxShadow: { lg: '-8px 0 40px rgba(0,0,0,0.3)' },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: { xs: '0 8px 40px rgba(0,0,0,0.3)', lg: 'none' },
              bgcolor: { xs: 'rgba(255,255,255,0.95)', lg: 'transparent' },
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              {/* Mobile Logo */}
              <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <WorkIcon sx={{ color: 'white', fontSize: 22 }} />
                </Box>
                <Typography variant="h6" fontWeight={800} color="primary">TechNova HRMS</Typography>
              </Box>

              <Typography variant="h5" fontWeight={800} gutterBottom>
                Welcome back 👋
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Sign in to your TechNova HRMS account
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  margin="normal"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }
                  }}
                  {...register('email')}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }
                  }}
                  {...register('password')}
                />

                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} size="small" />}
                  label={<Typography variant="body2">Remember me</Typography>}
                  sx={{ mt: 1 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 2, py: 1.5, fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)' },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>

                {/* Registration links removed - admin creation only */}

              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoginPage;
