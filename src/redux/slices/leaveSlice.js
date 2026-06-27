import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';

export const applyLeave = createAsyncThunk('leave/apply', async (data, { rejectWithValue }) => {
  try {
    const res = await leaveService.applyLeave(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to apply leave');
  }
});

export const fetchMyLeaves = createAsyncThunk('leave/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await leaveService.getMyLeaves();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch leaves');
  }
});

export const fetchMyBalance = createAsyncThunk('leave/fetchBalance', async (_, { rejectWithValue }) => {
  try {
    const res = await leaveService.getMyBalance();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch balance');
  }
});

export const fetchPendingRequests = createAsyncThunk('leave/fetchPending', async (_, { rejectWithValue }) => {
  try {
    const res = await leaveService.getPendingRequests();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch pending requests');
  }
});

export const fetchAllLeaves = createAsyncThunk('leave/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await leaveService.getAllLeaves();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch all leaves');
  }
});

export const approveLeave = createAsyncThunk('leave/approve', async (requestId, { rejectWithValue }) => {
  try {
    const res = await leaveService.approveLeave(requestId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to approve leave');
  }
});

export const rejectLeave = createAsyncThunk('leave/reject', async (requestId, { rejectWithValue }) => {
  try {
    const res = await leaveService.rejectLeave(requestId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to reject leave');
  }
});

export const cancelLeave = createAsyncThunk('leave/cancel', async (requestId, { rejectWithValue }) => {
  try {
    const res = await leaveService.cancelLeave(requestId);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to cancel leave');
  }
});

// Helper: update a leave in a list
const updateLeaveInList = (list, updated) =>
  list.map(l => l.id === updated.id ? updated : l);

const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    myLeaves: [],
    balance: null,
    pendingRequests: [],
    allLeaves: [],
    loading: false,
    actionLoading: false,
    error: null,
    applySuccess: false,
  },
  reducers: {
    clearLeaveError: (state) => { state.error = null; },
    clearApplySuccess: (state) => { state.applySuccess = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => { state.actionLoading = true; state.error = null; state.applySuccess = false; })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.applySuccess = true;
        state.myLeaves = [action.payload, ...state.myLeaves];
      })
      .addCase(applyLeave.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(fetchMyLeaves.pending, (state) => { state.loading = true; })
      .addCase(fetchMyLeaves.fulfilled, (state, action) => { state.loading = false; state.myLeaves = action.payload || []; })
      .addCase(fetchMyLeaves.rejected, (state) => { state.loading = false; })

      .addCase(fetchMyBalance.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBalance.fulfilled, (state, action) => { state.loading = false; state.balance = action.payload; })
      .addCase(fetchMyBalance.rejected, (state) => { state.loading = false; })

      .addCase(fetchPendingRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => { state.loading = false; state.pendingRequests = action.payload || []; })
      .addCase(fetchPendingRequests.rejected, (state) => { state.loading = false; })

      .addCase(fetchAllLeaves.pending, (state) => { state.loading = true; })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => { state.loading = false; state.allLeaves = action.payload || []; })
      .addCase(fetchAllLeaves.rejected, (state) => { state.loading = false; })

      .addCase(approveLeave.pending, (state) => { state.actionLoading = true; })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        const targetId = action.payload?.id || action.meta.arg;
        state.pendingRequests = state.pendingRequests.filter(l => Number(l.id) !== Number(targetId));
        state.allLeaves = updateLeaveInList(state.allLeaves, action.payload);
      })
      .addCase(approveLeave.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(rejectLeave.pending, (state) => { state.actionLoading = true; })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        const targetId = action.payload?.id || action.meta.arg;
        state.pendingRequests = state.pendingRequests.filter(l => Number(l.id) !== Number(targetId));
        state.allLeaves = updateLeaveInList(state.allLeaves, action.payload);
      })
      .addCase(rejectLeave.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; })

      .addCase(cancelLeave.pending, (state) => { state.actionLoading = true; })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.myLeaves = updateLeaveInList(state.myLeaves, action.payload);
      })
      .addCase(cancelLeave.rejected, (state, action) => { state.actionLoading = false; state.error = action.payload; });
  },
});

export const { clearLeaveError, clearApplySuccess } = leaveSlice.actions;
export default leaveSlice.reducer;
