import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', px: 2 }}>
      <ReportIcon sx={{ fontSize: 100, color: 'warning.main', mb: 3 }} />
      <Typography variant="h3" fontWeight={800} gutterBottom>500 - Server Error</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 2 }}>
        An unexpected error occurred. Please try refreshing the page or try again later.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2, py: 1.25, px: 4, borderRadius: 2.5 }}>
        Return to Dashboard
      </Button>
    </Box>
  );
};

export default ServerError;
