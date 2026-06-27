import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from '../../services/attendanceService';

export const checkIn = createAsyncThunk('attendance/checkIn', async (_, { rejectWithValue }) => {
  try {
    const res = await attendanceService.checkIn();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Check-in failed');
  }
});

export const checkOut = createAsyncThunk('attendance/checkOut', async (_, { rejectWithValue }) => {
  try {
    const res = await attendanceService.checkOut();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Check-out failed');
  }
});

export const fetchTodayRecord = createAsyncThunk('attendance/fetchToday', async (_, { rejectWithValue }) => {
  try {
    const res = await attendanceService.getTodayRecord();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch today record');
  }
});

export const fetchUserHistory = createAsyncThunk('attendance/fetchHistory', async (_, { rejectWithValue }) => {
  try {
    const res = await attendanceService.getUserHistory();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch attendance history');
  }
});

export const fetchAttendanceBetween = createAsyncThunk('attendance/fetchBetween', async ({ start, end }, { rejectWithValue }) => {
  try {
    const res = await attendanceService.getAttendanceBetween(start, end);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || 'Failed to fetch attendance range');
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    today: null,
    history: [],
    rangeRecords: [],
    loading: false,
    checkInLoading: false,
    checkOutLoading: false,
    error: null,
  },
  reducers: {
    clearAttendanceError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => { state.checkInLoading = true; state.error = null; })
      .addCase(checkIn.fulfilled, (state, action) => { state.checkInLoading = false; state.today = action.payload; })
      .addCase(checkIn.rejected, (state, action) => { state.checkInLoading = false; state.error = action.payload; })

      .addCase(checkOut.pending, (state) => { state.checkOutLoading = true; state.error = null; })
      .addCase(checkOut.fulfilled, (state, action) => { state.checkOutLoading = false; state.today = action.payload; })
      .addCase(checkOut.rejected, (state, action) => { state.checkOutLoading = false; state.error = action.payload; })

      .addCase(fetchTodayRecord.pending, (state) => { state.loading = true; })
      .addCase(fetchTodayRecord.fulfilled, (state, action) => { state.loading = false; state.today = action.payload; })
      .addCase(fetchTodayRecord.rejected, (state) => { state.loading = false; })

      .addCase(fetchUserHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchUserHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload || []; })
      .addCase(fetchUserHistory.rejected, (state) => { state.loading = false; })

      .addCase(fetchAttendanceBetween.pending, (state) => { state.loading = true; })
      .addCase(fetchAttendanceBetween.fulfilled, (state, action) => { state.loading = false; state.rangeRecords = action.payload || []; })
      .addCase(fetchAttendanceBetween.rejected, (state) => { state.loading = false; });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
