import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Box, Typography, Avatar,
  Menu, MenuItem, Divider, Tooltip, Badge, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/dashboardSlice';
import { logout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const TopBar = ({ onMenuClick, onToggleSidebar, sidebarCollapsed, sidebarWidth, isMobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeMode, notifications } = useSelector(state => state.dashboard);
  const { user } = useSelector(state => state.auth);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
    handleMenuClose();
  };

  const handleThemeToggle = () => dispatch(toggleTheme());

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: { md: `calc(100% - ${sidebarWidth}px)` },
        ml: { md: `${sidebarWidth}px` },
        transition: 'width 0.3s ease, margin 0.3s ease',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        {/* Menu button (mobile) */}
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Collapse button (desktop) */}
        {!isMobile && (
          <IconButton edge="start" onClick={onToggleSidebar} sx={{ mr: 1.5 }}>
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}

        {/* Page title area */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" fontSize="0.75rem">
            Welcome back,
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            {user?.username || 'User'}
          </Typography>
        </Box>

        {/* Action icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Theme toggle */}
          <Tooltip title={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={handleThemeToggle} size="small">
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton size="small" onClick={handleNotifOpen}>
              <Badge badgeContent={unreadCount} color="error" max={9}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Profile">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 0.5 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: { minWidth: 200, borderRadius: 2, mt: 1 },
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>{user?.username}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.role}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
            <LogoutIcon fontSize="small" />
            <Typography variant="body2" fontWeight={600}>Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: { minWidth: 300, maxWidth: 340, borderRadius: 2, mt: 1 },
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
            {unreadCount > 0 && (
              <Typography variant="caption" color="primary">{unreadCount} new</Typography>
            )}
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            notifications.slice(0, 5).map(n => (
              <MenuItem key={n.id} sx={{ py: 1.5, whiteSpace: 'normal', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{n.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.message}</Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
