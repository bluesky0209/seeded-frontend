import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const seededWalletTotalSlice = createSlice({
  name: 'seededWalletTotal',
  initialState: {
    value: 0,
  },
  reducers: {
    updateSeededWalletTotal: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateSeededWalletTotal } = seededWalletTotalSlice.actions;
export const seededWalletTotal = (state: RootState) =>
  state.seededWalletTotal.value;

export default seededWalletTotalSlice;
