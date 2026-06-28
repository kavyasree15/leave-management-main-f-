import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  CircularProgress, MenuItem, Select, FormControl, InputLabel, Stack, Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, approveUser, registerUser } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import PageHeader from '../../components/common/PageHeader';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [hrList, setHrList] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [hrId, setHrId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (createOpen) {
      authService.getHrUsers()
        .then(res => setHrList(res.data))
        .catch(err => console.error("Failed to load HR users", err));
    }
  }, [createOpen]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !role) {
      toast.error("Please fill in all mandatory fields");
      return;
    }
    if (role === 'EMPLOYEE' && !hrId) {
      toast.error("Please assign an HR officer to the employee");
      return;
    }
    if (role === 'MANAGER' && !hrId) {
      toast.error("Please assign an HR officer to the manager (required for leave approvals)");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { username, email, password, role, hrId: (role === 'EMPLOYEE' || role === 'MANAGER') ? hrId : null };
      const result = await dispatch(registerUser(payload));
      if (registerUser.fulfilled.match(result)) {
        toast.success(`User ${username} created successfully!`);
        setCreateOpen(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('EMPLOYEE');
        setHrId('');
        dispatch(fetchAllUsers());
      } else {
        toast.error(result.payload || "Failed to create user");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenConfirm = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedUser(null);
    setConfirmOpen(false);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    const result = await dispatch(approveUser(selectedUser.id));
    if (approveUser.fulfilled.match(result)) {
      toast.success(`Approved registration for ${selectedUser.username}`);
    } else {
      toast.error(result.payload || 'Approval failed');
    }
    handleCloseConfirm();
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'username', headerName: 'Username', width: 180 },
    { field: 'email', headerName: 'Email Address', width: 220 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'managerId', headerName: 'Manager ID', width: 130, valueFormatter: (params) => params || 'None' },
    {
      field: 'kycStatus',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => {
        const row = params.row;
        if (row.role !== 'EMPLOYEE') {
          return (
            <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, height: '100%' }}>
              <CheckCircleIcon fontSize="small" /> Active
            </Box>
          );
        }
        const status = row.kycStatus || 'PENDING';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Chip
              label={status}
              size="small"
              color={status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning'}
              sx={{ fontWeight: 600 }}
            />
          </Box>
        );
      }
    }
  ];

  return (
    <Box>
      <PageHeader
        title="User & Registration Management"
        subtitle="Manage employees, managers, and registration flows"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'User Management' }]}
      />

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              placeholder="Search by username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateOpen(true)}
              sx={{ borderRadius: 2.5, px: 3.5, py: 1, textTransform: 'none', fontWeight: 700 }}
            >
              Create User
            </Button>
          </Box>

          <Box sx={{ height: 500, width: '100%' }}>
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'background.default',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                  },
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateUser} sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              fullWidth
              required
            />

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              fullWidth
              required
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              fullWidth
              required
            />

            {(role === 'EMPLOYEE' || role === 'MANAGER') && (
              <FormControl fullWidth size="small" required>
                <InputLabel>{role === 'MANAGER' ? 'Assigned HR (for leave approvals)' : 'Assigned HR'}</InputLabel>
                <Select
                  value={hrId}
                  label={role === 'MANAGER' ? 'Assigned HR (for leave approvals)' : 'Assigned HR'}
                  onChange={(e) => setHrId(e.target.value)}
                >
                  {hrList.length === 0 ? (
                    <MenuItem disabled>No HR users found — create an HR first</MenuItem>
                  ) : hrList.map(hr => (
                    <MenuItem key={hr.id} value={hr.id}>{hr.username} ({hr.email})</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
              <Button onClick={() => setCreateOpen(false)} color="inherit" disabled={submitting}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? <CircularProgress size={24} /> : 'Create User'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
