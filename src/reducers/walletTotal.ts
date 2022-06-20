import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';


const walletTotalSlice = createSlice({
  name: 'walletTotal',
  initialState: {
    value: 0,
  },
  reducers: {
    updateWalletTotal: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateWalletTotal } = walletTotalSlice.actions;
export const walletTotal = (state: RootState) => state.walletTotal.value

export default walletTotalSlice;
