import React, { useEffect } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button,
  Avatar, Divider, CircularProgress, List, ListItem,
  ListItemText, ListItemAvatar, Chip
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import StatsCard from '../../components/common/StatsCard';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';

import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BadgeIcon from '@mui/icons-material/Badge';

const roleColor = { EMPLOYEE: 'primary', MANAGER: 'secondary', HR: 'success', ADMIN: 'error' };

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, usersLoading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const totalUsers   = users.length;
  const employees    = users.filter(u => u.role === 'EMPLOYEE');
  const managers     = users.filter(u => u.role === 'MANAGER');
  const hrUsers      = users.filter(u => u.role === 'HR');
  const recentUsers  = [...users].reverse().slice(0, 3);

  return (
    <Box>
      <PageHeader
        title="Admin Portal"
        subtitle="Manage users, roles and system access"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={6} sm={3}>
          <StatsCard title="Total Users" value={totalUsers} icon={PeopleIcon} color="primary" loading={usersLoading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard title="Employees" value={employees.length} icon={BadgeIcon} color="info" loading={usersLoading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard title="Managers" value={managers.length} icon={ManageAccountsIcon} color="secondary" loading={usersLoading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard title="HR Users" value={hrUsers.length} icon={GroupsIcon} color="success" loading={usersLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Recently Created Users</Typography>
                <Button
                  size="small"
                  startIcon={<PersonAddIcon />}
                  variant="contained"
                  onClick={() => navigate(ROUTES.ADMIN_USERS)}
                  sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                >
                  Manage Users
                </Button>
              </Box>

              {usersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recentUsers.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <PeopleIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">No users created yet.</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {recentUsers.map((usr, i) => (
                    <React.Fragment key={usr.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: `${roleColor[usr.role] || 'primary'}.main`, fontWeight: 700 }}>
                            {(usr.username || 'U').charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" fontWeight={600}>{usr.username}</Typography>
                              <Chip label={usr.role} size="small" color={roleColor[usr.role] || 'default'} sx={{ fontSize: '0.65rem' }} />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {usr.email}
                            </Typography>
                          }
                        />
                        <Chip
                          label={usr.kycStatus === 'APPROVED' ? 'Active' : usr.kycStatus === 'PENDING' || usr.kycStatus === 'PENDING_MANAGER' ? 'Pending KYC' : usr.kycStatus || 'Active'}
                          size="small"
                          color={usr.kycStatus === 'APPROVED' ? 'success' : 'warning'}
                          variant="outlined"
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Admin Actions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                As a system administrator, you can create and manage user accounts across all roles.
                KYC verification is handled by the assigned Manager.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate(ROUTES.ADMIN_USERS)}
                  sx={{
                    borderRadius: 2.5, textTransform: 'none', fontWeight: 700, py: 1.3,
                    background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
                    '&:hover': { background: '#1E1B4B' }
                  }}
                >
                  Create / Manage Users
                </Button>

                <Card variant="outlined" sx={{ borderRadius: 2.5, p: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>System Workflow</Typography>
                  {[
                    { step: '1', text: 'Admin creates HR, Manager & Employee accounts' },
                    { step: '2', text: 'Employee logs in and submits KYC form' },
                    { step: '3', text: 'HR assigns a reporting Manager to the employee' },
                    { step: '4', text: 'Manager reviews and approves/rejects KYC' },
                    { step: '5', text: 'Employee account becomes fully active' },
                  ].map(({ step, text }) => (
                    <Box key={step} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{
                        width: 22, height: 22, borderRadius: '50%', bgcolor: 'primary.main',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 800, flexShrink: 0, mt: 0.1
                      }}>
                        {step}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>{text}</Typography>
                    </Box>
                  ))}
                </Card>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
