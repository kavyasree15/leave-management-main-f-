import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', px: 2 }}>
      <WarningIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
      <Typography variant="h3" fontWeight={800} gutterBottom>404 - Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 2 }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2, py: 1.25, px: 4, borderRadius: 2.5 }}>
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
