import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  name: string;
  email: string;
  avatar: string | null;
  uploading: boolean;
}

const initialState: ProfileState = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null,
  uploading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
  },
});

export const { updateProfile, setAvatar, setUploading } = profileSlice.actions;
export default profileSlice.reducer;