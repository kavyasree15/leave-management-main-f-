import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography, Button, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../constants/routes';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated } = useSelector(state => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 2 : 0}
      sx={{
        background: scrolled
          ? theme.palette.mode === 'dark'
            ? 'rgba(13, 17, 32, 0.85)'
            : 'rgba(255, 255, 255, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid' : 'none',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        color: 'text.primary',
        zIndex: theme.zIndex.drawer + 2,
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important', justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
        {/* Left Side: Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Box sx={{
            width: 38, height: 38, borderRadius: 2,
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}>
            <WorkIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" fontWeight={850} sx={{ letterSpacing: '0.5px' }}>
            TechNova
          </Typography>
        </Box>

        {/* Center: Nav links (desktop only) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Features', id: 'features' },
              { label: 'Workflow', id: 'how-it-works' }
            ].map((link) => (
              <Typography
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  opacity: 0.8,
                  '&:hover': { opacity: 1, color: 'primary.main' },
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Typography>
            ))}
          </Box>
        )}

        {/* Right Side: CTA / Mobile menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {!isMobile && (
            <Button
              variant="contained"
              onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN)}
              sx={{
                borderRadius: 2.5,
                px: 3.5,
                py: 0.9,
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)'
                }
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
            </Button>
          )}

          {isMobile && (
            <IconButton edge="end" onClick={onMenuClick} sx={{ color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
