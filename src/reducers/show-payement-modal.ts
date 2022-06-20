import { createSlice } from '@reduxjs/toolkit';

const showPaymentModalSlice = createSlice({
  name: 'showPaymentModal',
  initialState: {
    show: false,
  },
  reducers: {
    update: (state ) => {

    },
    toggle: (state) => {
      state.show = !state.show;
    },
  },
});

export const showPaymentModal = showPaymentModalSlice.actions;

export default showPaymentModalSlice;
