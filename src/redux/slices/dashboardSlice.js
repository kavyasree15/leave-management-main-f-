import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    themeMode: localStorage.getItem('themeMode') || 'light',
    sidebarOpen: true,
    notifications: [],
  },
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({ ...action.payload, id: Date.now(), read: false });
    },
    markAllNotificationsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }));
    },
  },
});

export const { toggleTheme, toggleSidebar, setSidebarOpen, addNotification, markAllNotificationsRead } = dashboardSlice.actions;
export default dashboardSlice.reducer;
