import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Grid, Stack, Card, CardContent } from '@mui/material';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Counter = ({ value, suffix = '', duration = 1.2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const end = parseInt(value.toString().replace(/[^0-9]/g, ''), 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    let start = 0;
    const steps = 30;
    const stepTime = (duration * 1000) / steps;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        pt: '100px',
        pb: '40px',
        px: { xs: 3, md: 8 },
        overflow: 'hidden'
      }}
    >
      {/* Background blobs */}
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute', top: '5%', right: '5%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <Grid container spacing={4} sx={{ alignItems: 'center', position: 'relative', zIndex: 1, my: 'auto' }}>
        {/* Left Side Copy */}
        <Grid xs={12} md={7.5}>
          <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Typography 
                variant="subtitle2" 
                color="primary"
                fontWeight={800}
                sx={{
                  textTransform: 'uppercase', letterSpacing: '1.5px', mb: 1.5,
                  display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 2,
                  bgcolor: 'rgba(37,99,235,0.08)'
                }}
              >
                TechNova Pvt. Ltd.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  fontSize: { xs: '2.25rem', sm: '3.25rem', md: '4rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-1.5px',
                  mb: 2,
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'initial',
                }}
              >
                Leave & Attendance Management Portal
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3.5, maxWidth: 580, fontSize: '1.05rem', lineHeight: 1.55 }}>
                Simplifying Workforce Management with Smart Leave & Attendance Tracking. Built with cutting-edge microservices architecture for absolute scale and real-time reliability.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  sx={{
                    borderRadius: 2.5, px: 4, py: 1.5, fontWeight: 750, textTransform: 'none',
                    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                    boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
                    '&:hover': { background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)' }
                  }}
                >
                  Register
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    borderRadius: 2.5, px: 4, py: 1.5, fontWeight: 750, textTransform: 'none',
                    border: '2px solid', borderColor: 'divider',
                    '&:hover': { border: '2px solid', borderColor: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  Explore Features
                </Button>
              </Stack>
            </motion.div>
          </Box>
        </Grid>

        {/* Right Side Illustration */}
        <Grid xs={12} md={4.5}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            <Box
              component={motion.div}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              sx={{ width: '100%', maxWidth: 320, display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  background: (theme) => theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'white',
                  border: '1px solid', borderColor: 'divider',
                  boxShadow: '0 20px 40px rgba(37,99,235,0.12)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={800}>Attendance Index</Typography>
                    <SpeedIcon color="primary" />
                  </Stack>
                  <Typography variant="h3" fontWeight={900} color="primary" sx={{ mb: 1 }}>99.8%</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.4 }}>
                    Accuracy of daily shift check-ins and late entry logs.
                  </Typography>
                  <Box sx={{
                    p: 1.5, borderRadius: 2,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(16,185,129,0.1)' : 'rgba(209,250,229,0.6)',
                    color: (theme) => theme.palette.mode === 'dark' ? '#34D399' : '#047857',
                    display: 'flex', alignItems: 'center', gap: 1
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={750}>System Online & Kafka Active</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
