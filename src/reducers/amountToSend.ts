import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';


const amountToSendSlice = createSlice({
  name: 'amountToSend',
  initialState: {
    value: 0,
  },
  reducers: {
    updateAmountToSend: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { updateAmountToSend } = amountToSendSlice.actions;
export const amountToSend = (state: RootState) => state.amountToSend.value

export default amountToSendSlice;
