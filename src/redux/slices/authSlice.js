import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Restore user from storage
const storedUser = (() => {
  try {
    const data = localStorage.getItem('user') || sessionStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch { return null; }
})();
const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token') || null;

// Thunks
export const loginUser = createAsyncThunk('auth/login', async ({ credentials, rememberMe }, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    const { token, username, role, userId } = res.data;
    const user = { userId, username, role };
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(user));
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.response?.data || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.response?.data || 'Registration failed');
  }
});

export const fetchAllUsers = createAsyncThunk('auth/fetchAllUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getAllUsers();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchManagers = createAsyncThunk('auth/fetchManagers', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getManagers();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch managers');
  }
});

export const approveUser = createAsyncThunk('auth/approveUser', async (userId, { rejectWithValue }) => {
  try {
    await authService.approveUser(userId);
    return userId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to approve user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken,
    user: storedUser,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
    users: [],
    managers: [],
    usersLoading: false,
    managersLoading: false,
    registerSuccess: false,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
    clearRegisterSuccess: (state) => { state.registerSuccess = false; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; state.registerSuccess = false; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; state.registerSuccess = true; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Fetch all users
      .addCase(fetchAllUsers.pending, (state) => { state.usersLoading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.usersLoading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state) => { state.usersLoading = false; })
      // Fetch managers
      .addCase(fetchManagers.pending, (state) => { state.managersLoading = true; })
      .addCase(fetchManagers.fulfilled, (state, action) => { state.managersLoading = false; state.managers = action.payload; })
      .addCase(fetchManagers.rejected, (state) => { state.managersLoading = false; })
      // Approve user
      .addCase(approveUser.fulfilled, (state, action) => {
        const uid = action.payload;
        state.users = state.users.map(u => u.id === uid ? { ...u, approved: true } : u);
      });
  },
});

export const { logout, clearError, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
