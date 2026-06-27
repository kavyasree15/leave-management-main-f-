import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBalance } from '../../redux/slices/leaveSlice';
import PageHeader from '../../components/common/PageHeader';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const LeaveBalance = () => {
  const dispatch = useDispatch();
  const { balance, loading } = useSelector(state => state.leave);

  useEffect(() => {
    dispatch(fetchMyBalance());
  }, [dispatch]);

  const cards = [
    { title: 'Casual Leave Balance', total: 12, balance: balance?.casualLeave ?? 12, color: 'info.main', icon: BeachAccessIcon, details: 'For short-term personal needs or vacation.' },
    { title: 'Medical Leave Balance', total: 15, balance: balance?.medicalLeave ?? 15, color: 'error.main', icon: LocalHospitalIcon, details: 'For illness, health checks, or medical recover.' },
    { title: 'Paid Leave Balance', total: 18, balance: balance?.paidLeave ?? 18, color: 'success.main', icon: AttachMoneyIcon, details: 'Annual leaves accrued per working periods.' }
  ];

  return (
    <Box>
      <PageHeader
        title="Leave Ledger & Balances"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Leave Ledger' }]}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cards.map((c, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'background.default' }}>
                      <c.icon sx={{ color: c.color }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">Default Accruals: {c.total} days</Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom>{c.title}</Typography>
                  <Typography variant="h3" fontWeight={800} color={c.color} sx={{ my: 1.5 }}>
                    {c.balance} Days
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary">{c.details}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LeaveBalance;
