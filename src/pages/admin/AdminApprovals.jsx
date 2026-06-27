import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Divider, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, approveUser } from '../../redux/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { toast } from 'react-toastify';

const AdminApprovals = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const pendingApprovals = users.filter(u => !u.approved);

  const handleApprove = async (userId) => {
    const result = await dispatch(approveUser(userId));
    if (approveUser.fulfilled.match(result)) {
      toast.success('Approved User registration');
    } else {
      toast.error(result.payload || 'Approval failed');
    }
  };

  return (
    <Box>
      <PageHeader
        title="Pending Registrations"
        subtitle="Approve newly registered accounts so they can sign in"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Approvals' }]}
      />

      {usersLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : pendingApprovals.length === 0 ? (
        <EmptyState
          icon={HowToRegIcon}
          title="All Registrations Handled"
          description="There are currently no users pending registration approvals."
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendingApprovals.map((u) => (
            <Card key={u.id} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{u.username}</Typography>
                  <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                    Role Requested: <strong>{u.role}</strong> {u.managerId ? `| Manager ID: ${u.managerId}` : ''}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<HowToRegIcon />}
                  onClick={() => handleApprove(u.id)}
                  sx={{ borderRadius: 2 }}
                >
                  Approve Registration
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default AdminApprovals;
