import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import LoginIcon from '@mui/icons-material/Login';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import AddTaskIcon from '@mui/icons-material/AddTask';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const WorkflowSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useSelector(state => state.auth);

  const steps = [
    { icon: LoginIcon, title: 'Secure Login', desc: 'Auth via credentials and stateless JWT token.', color: '#3B82F6' },
    { icon: TouchAppIcon, title: 'Daily Check-In', desc: 'Logs check-in time and check-out durations.', color: '#10B981' },
    { icon: AddTaskIcon, title: 'Submit Request', desc: 'File casual or medical leaves with balances check.', color: '#EC4899' },
    { icon: VerifiedUserIcon, title: 'Dual Approval', desc: 'Supervisors and HR approve requests > 10 days.', color: '#8B5CF6' }
  ];

  return (
    <Box
      id="how-it-works"
      sx={{
        py: 10,
        px: { xs: 3, md: 8 },
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.2)' : 'rgba(241,245,249,0.3)',
        position: 'relative'
      }}
    >
      {/* 1. TIMELINE SUBSECTION */}
      <Box sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="subtitle2" color="primary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '1.5px', mb: 1.5 }}>
            Workflow Process
          </Typography>
          <Typography variant="h4" fontWeight={850} sx={{ letterSpacing: '-0.5px' }}>
            How The Portal Operates
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3, position: 'relative' }}>
          {!isMobile && (
            <Box sx={{ position: 'absolute', top: 34, left: '8%', right: '8%', height: 2, bgcolor: 'divider', zIndex: 0 }} />
          )}

          {steps.map((step, idx) => (
            <Box
              key={idx}
              component={motion.div}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              sx={{ flex: 1, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <Box sx={{
                width: 60, height: 60, borderRadius: '50%', bgcolor: 'background.paper',
                border: '3px solid', borderColor: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 2, transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.08)' }
              }}>
                <step.icon sx={{ color: step.color, fontSize: 22 }} />
              </Box>

              <Card sx={{ width: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" fontWeight={900} sx={{ color: step.color, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                    Step {idx + 1}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>{step.desc}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 2. CTA BANNER SUBSECTION */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 8 }}
      >
        <Card
          sx={{
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
            boxShadow: '0 16px 32px rgba(37,99,235,0.2)', border: 'none', color: 'white', overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', position: 'relative' }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 2, letterSpacing: '-0.5px' }}>
              Ready to Transform Workforce Management?
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, maxWidth: 580, mx: 'auto' }}>
              Experience a modern Leave & Attendance Management System built for enterprise organizations.
            </Typography>
            <Stack direction="row" sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.LOGIN)}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 2.5, px: 4, py: 1.5, fontWeight: 750, bgcolor: 'white', color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                }}
              >
                Sign In Now
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* 3. SIMPLIFIED FOOTER */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          TechNova Pvt. Ltd. © 2026. All rights reserved. Powered by Spring Cloud & React.
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkflowSection;
