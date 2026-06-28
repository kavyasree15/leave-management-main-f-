import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);
  const handleToggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const currentSidebarWidth = isMobile ? 260 : (sidebarCollapsed ? 70 : 260);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          variant="permanent"
          isCollapsed={sidebarCollapsed}
          width={currentSidebarWidth}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Sidebar
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          width={260}
        />
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          ml: { md: 0 },
        }}
      >
        <TopBar
          onMenuClick={handleDrawerToggle}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          sidebarWidth={currentSidebarWidth}
          isMobile={isMobile}
        />

        {/* Content area */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: '64px',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
