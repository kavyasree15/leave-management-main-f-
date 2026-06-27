import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', px: 2 }}>
      <SecurityIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h3" fontWeight={800} gutterBottom>403 - Access Denied</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 2 }}>
        You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2, py: 1.25, px: 4, borderRadius: 2.5 }}>
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default Forbidden;
