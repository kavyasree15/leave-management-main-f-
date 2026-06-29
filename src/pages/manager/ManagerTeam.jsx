import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab, Grid, Divider, Chip, Avatar, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import leaveService from '../../services/leaveService';
import attendanceService from '../../services/attendanceService';
import StatusChip from '../../components/common/StatusChip';
import { formatDate, formatDateTime, formatHours } from '../../utils/dateUtils';

const roleColor = { EMPLOYEE: 'primary', MANAGER: 'secondary', HR: 'success', ADMIN: 'error' };

const ManagerTeam = () => {
  const dispatch = useDispatch();
  const { users, usersLoading, user: currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog State
  const [selectedMember, setSelectedMember] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = Leaves, 1 = Attendance
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [memberBalance, setMemberBalance] = useState(null);
  const [memberLeaves, setMemberLeaves] = useState([]);
  const [memberAttendance, setMemberAttendance] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users that report to this manager
  const teamMembers = users.filter(u => u.managerId === (currentUser?.userId || currentUser?.id));

  const filteredTeam = teamMembers.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDetails = async (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
    setTabValue(0);
    setLoadingDetails(true);
    setMemberBalance(null);
    setMemberLeaves([]);
    setMemberAttendance([]);

    // Run calls independently so one failure doesn't block the others
    const fetchBalance = async () => {
      try {
        const balanceRes = await leaveService.getUserBalance(member.id);
        setMemberBalance(balanceRes.data);
      } catch (err) {
        console.error("Failed to load leave balance", err);
      }
    };

    const fetchLeaves = async () => {
      try {
        const leavesRes = await leaveService.getUserLeaves(member.id);
        setMemberLeaves(leavesRes.data);
      } catch (err) {
        console.error("Failed to load leave history", err);
      }
    };

    const fetchAttendance = async () => {
      try {
        const start = '2026-01-01';
        const end = '2026-12-31';
        const attendanceRes = await attendanceService.getUserAttendanceBetween(member.id, start, end);
        setMemberAttendance(attendanceRes.data);
      } catch (err) {
        console.error("Failed to load attendance logs", err);
      }
    };

    await Promise.all([fetchBalance(), fetchLeaves(), fetchAttendance()]);
    setLoadingDetails(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <Box>
      <PageHeader
        title="My Team Members"
        subtitle="Roster of all employees currently reporting directly to you"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'My Team' }]}
      />

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />

          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredTeam.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography color="text.secondary">No team members found.</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeam.map((row) => (
                    <TableRow 
                      key={row.id}
                      hover
                      onClick={() => handleOpenDetails(row)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>#{row.id}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                        {row.username}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        <Chip label={row.role} size="small" color={roleColor[row.role] || 'default'} sx={{ fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(row);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        {selectedMember && (
          <>
            <DialogTitle sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, fontWeight: 700, fontSize: '1.25rem' }}>
                  {selectedMember.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>{selectedMember.username}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedMember.email}</Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseDialog} sx={{ color: 'text.secondary' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Divider />

            <Tabs 
              value={tabValue} 
              onChange={(e, val) => setTabValue(val)} 
              sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}
            >
              <Tab label="Leaves History & Balances" sx={{ py: 2, fontWeight: 700 }} />
              <Tab label="Attendance Logs" sx={{ py: 2, fontWeight: 700 }} />
            </Tabs>

            <DialogContent sx={{ p: 3, minHeight: 400 }}>
              {loadingDetails ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 350, gap: 2 }}>
                  <CircularProgress size={40} />
                  <Typography color="text.secondary" variant="body2">Loading employee dashboard history...</Typography>
                </Box>
              ) : (
                <Box>
                  {tabValue === 0 ? (
                    // LEAVES TAB
                    <Box>
                      {/* Leave Balances Cards */}
                      <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ mb: 2 }}>Current Remaining Balances</Typography>
                      <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={4}>
                          <Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" fontWeight={800} color="info.main">
                              {memberBalance?.casualLeave ?? 12}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>CASUAL LEAVE</Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={4}>
                          <Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" fontWeight={800} color="error.main">
                              {memberBalance?.medicalLeave ?? 15}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>MEDICAL LEAVE</Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={4}>
                          <Card variant="outlined" sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                            <Typography variant="h5" fontWeight={800} color="success.main">
                              {memberBalance?.paidLeave ?? 18}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>PAID LEAVE</Typography>
                          </Card>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 3 }} />

                      {/* Leave History Table */}
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>Leaves Applied Details</Typography>
                      {memberLeaves.length === 0 ? (
                        <Box sx={{ py: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                          <InfoIcon color="disabled" sx={{ fontSize: 32, mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">No leaves applied by this user yet.</Typography>
                        </Box>
                      ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Leave Type</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Reason</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {memberLeaves.map((leave) => (
                                <TableRow key={leave.id}>
                                  <TableCell sx={{ fontWeight: 600 }}>{leave.leaveType}</TableCell>
                                  <TableCell>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</TableCell>
                                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {leave.reason}
                                  </TableCell>
                                  <TableCell>
                                    <StatusChip status={leave.status} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  ) : (
                    // ATTENDANCE TAB
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>Recent Daily Records (Current Year)</Typography>
                      {memberAttendance.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                          <InfoIcon color="disabled" sx={{ fontSize: 32, mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">No attendance logs found for this year.</Typography>
                        </Box>
                      ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: 'background.default' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Check-In Time</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Check-Out Time</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Late Arrival</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Working Hours</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {[...memberAttendance].reverse().map((att) => (
                                <TableRow key={att.id}>
                                  <TableCell sx={{ fontWeight: 600 }}>{formatDate(att.date)}</TableCell>
                                  <TableCell>{formatDateTime(att.checkIn, 'HH:mm:ss')}</TableCell>
                                  <TableCell>{att.checkOut ? formatDateTime(att.checkOut, 'HH:mm:ss') : '—'}</TableCell>
                                  <TableCell>
                                    {att.late ? (
                                      <Chip label="Yes" size="small" color="error" variant="outlined" icon={<CancelIcon fontSize="small" />} sx={{ fontWeight: 700, height: 22 }} />
                                    ) : (
                                      <Chip label="No" size="small" color="success" variant="outlined" icon={<CheckCircleIcon fontSize="small" />} sx={{ fontWeight: 700, height: 22 }} />
                                    )}
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>{formatHours(att.workingHours)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2.5, bgcolor: 'background.default' }}>
              <Button onClick={handleCloseDialog} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 700 }}>
                Close Dashboard
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ManagerTeam;
