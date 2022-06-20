import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const seededSplPubkeySlice = createSlice({
  name: 'spl pubkey',
  initialState: {
    value: '',
  },
  reducers: {
    updateSeededSplPubkey: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { updateSeededSplPubkey } = seededSplPubkeySlice.actions;
export const seededSplPubkey = (state: RootState) =>
  state.seededSplPubkey.value;

export default seededSplPubkeySlice;
