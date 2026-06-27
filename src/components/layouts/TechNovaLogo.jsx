import React from 'react';
import { Box, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

const TechNovaLogo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{
      width: 36, height: 36, borderRadius: 2,
      background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
    }}>
      <WorkIcon sx={{ color: 'white', fontSize: 20 }} />
    </Box>
    <Box>
      <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'white', lineHeight: 1 }}>
        TechNova
      </Typography>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
        HRMS Portal
      </Typography>
    </Box>
  </Box>
);

export default TechNovaLogo;
