import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';

const ManagerTeam = () => {
  const dispatch = useDispatch();
  const { users, usersLoading, user: currentUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Filter users that report to this manager
  const teamMembers = users.filter(u => u.managerId === (currentUser?.userId || currentUser?.id));

  const filteredTeam = teamMembers.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeam.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>#{row.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.username}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManagerTeam;
