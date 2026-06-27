import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment, Button,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, approveUser } from '../../redux/slices/authSlice';
import PageHeader from '../../components/common/PageHeader';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

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
      field: 'approved',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value ? (
            <Box sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon fontSize="small" /> Approved
            </Box>
          ) : (
            <Box sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HowToRegIcon fontSize="small" /> Pending Approval
            </Box>
          )}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        if (!params.row.approved) {
          return (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleOpenConfirm(params.row)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Approve
            </Button>
          );
        }
        return null;
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
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              placeholder="Search by username, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
        <DialogTitle>Approve User Registration?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve user <strong>{selectedUser?.username}</strong> ({selectedUser?.email})?
            This will allow them to login and access functions matching their role: {selectedUser?.role}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">Cancel</Button>
          <Button onClick={handleApprove} color="success" variant="contained">Approve User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
