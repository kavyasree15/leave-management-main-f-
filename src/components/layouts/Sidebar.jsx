import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Tooltip, Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TechNovaLogo from './TechNovaLogo';

export const SIDEBAR_WIDTH = 260;

const navItemsByRole = {
  EMPLOYEE: [
    { label: 'Dashboard', icon: DashboardIcon, path: ROUTES.DASHBOARD },
    { label: 'Attendance', icon: AccessTimeIcon, path: ROUTES.ATTENDANCE, dividerBefore: true },
    { label: 'Attendance History', icon: HistoryIcon, path: ROUTES.ATTENDANCE_HISTORY },
    { label: 'Apply Leave', icon: EventNoteIcon, path: ROUTES.LEAVE_APPLY, dividerBefore: true },
    { label: 'Leave History', icon: ListAltIcon, path: ROUTES.LEAVE_HISTORY },
    { label: 'Leave Balance', icon: AccountBalanceWalletIcon, path: ROUTES.LEAVE_BALANCE },
  ],
  MANAGER: [
    { label: 'Dashboard', icon: DashboardIcon, path: ROUTES.DASHBOARD },
    { label: 'Pending Approvals', icon: PendingActionsIcon, path: ROUTES.MANAGER_APPROVALS, dividerBefore: true },
    { label: 'My Team', icon: GroupIcon, path: ROUTES.MANAGER_TEAM },
    { label: 'Leave History', icon: ListAltIcon, path: ROUTES.LEAVE_HISTORY, dividerBefore: true },
    { label: 'Attendance History', icon: HistoryIcon, path: ROUTES.ATTENDANCE_HISTORY },
  ],
  HR: [
    { label: 'Dashboard', icon: DashboardIcon, path: ROUTES.DASHBOARD },
    { label: 'Pending HR Leaves', icon: PendingActionsIcon, path: ROUTES.MANAGER_APPROVALS, dividerBefore: true },
    { label: 'HR Analytics', icon: AssessmentIcon, path: ROUTES.HR_ANALYTICS, dividerBefore: true },
    { label: 'Attendance Report', icon: BarChartIcon, path: ROUTES.HR_ATTENDANCE_REPORT },
    { label: 'Leave Report', icon: TimelineIcon, path: ROUTES.HR_LEAVE_REPORT },
  ],
  ADMIN: [
    { label: 'Dashboard', icon: DashboardIcon, path: ROUTES.DASHBOARD },
    { label: 'Pending Approvals', icon: HowToRegIcon, path: ROUTES.ADMIN_APPROVALS, dividerBefore: true },
    { label: 'User Management', icon: AdminPanelSettingsIcon, path: ROUTES.ADMIN_USERS },
  ],
};

const roleColors = {
  EMPLOYEE: 'primary',
  MANAGER: 'secondary',
  HR: 'success',
  ADMIN: 'error',
};

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role || 'EMPLOYEE';
  const navItems = navItemsByRole[role] || navItemsByRole.EMPLOYEE;

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #0d1224 0%, #131929 100%)'
            : 'linear-gradient(180deg, #1E1B4B 0%, #312E81 100%)',
      }}
    >
      {/* Logo Area */}
      <Box sx={{ p: 3, pb: 2 }}>
        <TechNovaLogo />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.5 }}>
          Leave & Attendance Portal
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* User Profile */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1.5, borderRadius: 2,
          background: 'rgba(255,255,255,0.08)',
        }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: 'white', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || 'User'}
            </Typography>
            <Chip
              label={role}
              size="small"
              color={roleColors[role] || 'primary'}
              sx={{ fontSize: '0.62rem', height: 16, mt: 0.5, fontWeight: 700 }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List dense>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <React.Fragment key={item.path}>
                {item.dividerBefore && (
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 0.5 }} />
                )}
                <ListItem disablePadding sx={{ px: 1.5, py: 0.25 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      position: 'relative',
                      transition: 'all 0.2s',
                      bgcolor: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    {isActive && (
                      <Box sx={{
                        position: 'absolute', left: 0, top: '20%', bottom: '20%',
                        width: 3, borderRadius: 4, bgcolor: '#818CF8',
                      }} />
                    )}
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <item.icon
                        fontSize="small"
                        sx={{ color: isActive ? '#818CF8' : 'rgba(255,255,255,0.5)' }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 700 : 400,
                            color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Footer */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', textAlign: 'center' }}>
          TechNova Pvt. Ltd. © 2024
        </Typography>
      </Box>
    </Box>
  );
};

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          border: 'none',
          transition: 'width 0.3s ease',
        },
      }}
      open
    >
      <SidebarContent />
    </Drawer>
  );
};

export default Sidebar;
