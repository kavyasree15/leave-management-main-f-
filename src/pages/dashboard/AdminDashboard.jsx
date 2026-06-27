import React, { useEffect } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button, Avatar, Chip,
  List, ListItem, ListItemText, ListItemAvatar, Divider, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, approveUser } from '../../redux/slices/authSlice';
import StatsCard from '../../components/common/StatsCard';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';
import PeopleIcon from '@mui/icons-material/People';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, usersLoading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const pendingApprovals = users.filter(u => !u.approved);
  const totalUsers = users.length;
  const managersCount = users.filter(u => u.role === 'MANAGER').length;
  const adminsCount = users.filter(u => u.role === 'ADMIN').length;

  const handleApprove = async (userId) => {
    const result = await dispatch(approveUser(userId));
    if (approveUser.fulfilled.match(result)) {
      toast.success('User approved successfully');
    } else {
      toast.error(result.payload || 'Approval failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Admin Portal Dashboard"
        subtitle="System administration, role config and user registration approvals"
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={3}>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Registrations" value={totalUsers} icon={PeopleIcon} color="primary" loading={usersLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Pending Approvals" value={pendingApprovals.length} icon={HowToRegIcon} color="warning" loading={usersLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="Total Managers" value={managersCount} icon={PeopleIcon} color="success" loading={usersLoading} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatsCard title="System Admins" value={adminsCount} icon={AdminPanelSettingsIcon} color="error" loading={usersLoading} />
        </Grid>

        {/* Pending Registration Approvals Section */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Pending Registrations</Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(ROUTES.ADMIN_APPROVALS)}
                >
                  View All
                </Button>
              </Box>

              {usersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pendingApprovals.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <HowToRegIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                  <Typography color="text.secondary" fontWeight={500}>
                    All registrations have been approved!
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {pendingApprovals.slice(0, 4).map((usr, i) => (
                    <React.Fragment key={usr.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main', fontWeight: 700 }}>
                            {(usr.username || 'U').charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={usr.username}
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {`${usr.email} | Requested Role: ${usr.role}`}
                            </Typography>
                          }
                        />
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(usr.id)}
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Approve
                        </Button>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Help Card */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>System Operations Console</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                As a system administrator, you can view the system's active roster, approve new registrations, and audit system activities.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<AdminPanelSettingsIcon />}
                  onClick={() => navigate(ROUTES.ADMIN_USERS)}
                >
                  Manage System Users
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  color="warning"
                  startIcon={<HowToRegIcon />}
                  onClick={() => navigate(ROUTES.ADMIN_APPROVALS)}
                >
                  Pending Registration Approvals ({pendingApprovals.length})
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
