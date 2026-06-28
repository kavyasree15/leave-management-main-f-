import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Divider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Sections
import Navbar from '../../components/landing/Navbar';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import WorkflowSection from '../../components/landing/WorkflowSection';

const LandingPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen(prev => !prev);

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Workflow', id: 'how-it-works' }
  ];

  const handleScrollTo = (id) => {
    handleDrawerToggle();
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sticky Transparent Navbar */}
      <Navbar onMenuClick={handleDrawerToggle} />

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            background: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
            p: 2.5
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navLinks.map((link) => (
            <ListItem disablePadding key={link.id} sx={{ mb: 1 }}>
              <ListItemButton onClick={() => handleScrollTo(link.id)} sx={{ borderRadius: 2 }}>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {link.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Section Viewports (Consolidated 3-Page Flow) */}
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
    </Box>
  );
};

export default LandingPage;
