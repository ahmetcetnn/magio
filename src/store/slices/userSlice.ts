"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserProfile = {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
};

type UserState = {
  profile?: UserProfile;
  loading: boolean;
  error?: string;
};

const initialState: UserState = {
  profile: undefined,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchProfileStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchProfileSuccess(state, action: PayloadAction<UserProfile>) {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchProfileError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearUser(state) {
      state.profile = undefined;
      state.loading = false;
      state.error = undefined;
    },
  },
});

export const { fetchProfileStart, fetchProfileSuccess, fetchProfileError, clearUser } = userSlice.actions;
export default userSlice.reducer;
