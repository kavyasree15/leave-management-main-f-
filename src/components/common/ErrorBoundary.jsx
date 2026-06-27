import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', textAlign: 'center', px: 2,
          bgcolor: 'background.default', color: 'text.primary'
        }}>
          <ReportIcon sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
          <Typography variant="h3" fontWeight={800} gutterBottom>Something went wrong</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 2 }}>
            An unexpected error occurred in the application view rendering. Try reloading the page or contact support.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2, py: 1.25, px: 4, borderRadius: 2.5 }}>
            Reload Application
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
