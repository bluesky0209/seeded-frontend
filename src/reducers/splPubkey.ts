import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';


const splPubkeySlice = createSlice({
  name: 'spl pubkey',
  initialState: {
    value: "",
  },
  reducers: {
    updateSplPubkey: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { updateSplPubkey } = splPubkeySlice.actions;
export const splPubkey = (state: RootState) => state.splPubkey.value

export default splPubkeySlice;
