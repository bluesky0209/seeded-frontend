import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { PresaleProps } from '../components/presale-card/view';

const initialPresale: PresaleProps = {
  hardcap: 100000000000,
  isActive: false,
  isWhitelist: false,
  maxAllocation: 0,
  minAllocation: 0,
  totalRaised: 0,
};

const presaleSlice = createSlice({
  name: 'presale',
  initialState: {
    data: initialPresale,
  },
  reducers: {
    update: (state, action: PayloadAction<PresaleProps>) => {
      state.data = action.payload;
    },
  },
});

export const { update } = presaleSlice.actions;
export const presaleData = (state: RootState) => state.presale.data

export default presaleSlice;
