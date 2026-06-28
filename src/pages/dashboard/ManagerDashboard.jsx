import React, { useEffect } from 'react';
import {
  Grid, Box, Card, CardContent, Typography, Button, Avatar, Chip,
  List, ListItem, ListItemText, ListItemAvatar, Divider, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { fetchPendingRequests, fetchAllLeaves } from '../../redux/slices/leaveSlice';
import { fetchUserHistory } from '../../redux/slices/attendanceSlice';
import StatsCard from '../../components/common/StatsCard';
import StatusChip from '../../components/common/StatusChip';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants/routes';
import { formatDate } from '../../utils/dateUtils';

import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingRequests, allLeaves, loading } = useSelector(state => state.leave);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchPendingRequests());
    dispatch(fetchAllLeaves());
  }, [dispatch]);

  const myTeamLeaves = allLeaves.filter(l => Number(l.managerId) === Number(user?.userId || user?.id));
  const pendingCount = pendingRequests.length;
  const approvedCount = myTeamLeaves.filter(l => l.status === 'APPROVED' || l.status === 'PENDING_HR').length;
  const totalTeamLeaves = myTeamLeaves.length;

  // Leave type distribution bar chart
  const leaveTypeData = ['CASUAL', 'MEDICAL', 'PAID', 'UNPAID'].map(type => ({
    name: type.charAt(0) + type.slice(1).toLowerCase(),
    count: myTeamLeaves.filter(l => l.leaveType === type).length,
  }));

  return (
    <Box>
      <PageHeader
        title={`Manager Dashboard`}
        subtitle={`Welcome, ${user?.username} | Review and manage your team's leave requests`}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      <Grid container spacing={3}>
        <Grid xs={6} sm={3}>
          <StatsCard title="Pending Approvals" value={pendingCount} icon={PendingActionsIcon} color="warning" loading={loading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard title="Approved Leaves" value={approvedCount} icon={CheckCircleIcon} color="success" loading={loading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard title="Total Requests" value={totalTeamLeaves} icon={GroupIcon} color="info" loading={loading} />
        </Grid>
        <Grid xs={6} sm={3}>
          <StatsCard
            title="Avg Response"
            value="< 2d"
            subtitle="approval time"
            icon={AccessTimeIcon}
            color="primary"
            loading={loading}
          />
        </Grid>

        {/* Pending Requests */}
        <Grid xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>Pending Approvals</Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(ROUTES.MANAGER_APPROVALS)}
                >
                  View All
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pendingRequests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                  <Typography color="text.secondary" fontWeight={500}>
                    All caught up! No pending approvals.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {pendingRequests.slice(0, 4).map((req, i) => (
                    <React.Fragment key={req.id}>
                      {i > 0 && <Divider />}
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700 }}>
                            {(req.userId || '?').toString().charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={600}>Employee #{req.userId}</Typography>
                              <Chip label={req.leaveType} size="small" variant="outlined" color="primary" />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: '0.75rem' }}>
                              {`${formatDate(req.startDate)} → ${formatDate(req.endDate)} | ${req.reason}`}
                            </Typography>
                          }
                        />
                        <StatusChip status={req.status} />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Type Chart */}
        <Grid xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Leave Type Distribution</Typography>
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {leaveTypeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;
