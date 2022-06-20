import { combineReducers } from '@reduxjs/toolkit';

import showPaymentModalSlice from './show-payement-modal';
import presaleEndDateSlice from './presale-end-date';
import presaleSlice from './presale';
import walletTotalSlice from './walletTotal';
import seededWalletTotalSlice from './seededWalletTotal';
import amountToSendSlice from './amountToSend';
import splPubkeySlice from './splPubkey';
import seededSplPubkeySlice from './seededSplPubkey';
import lockEndDateSlice from './lock-end-date';

export { showPaymentModal } from './show-payement-modal';
export { presaleEndDate } from './presale-end-date';
export { update } from './presale';
export { updateSplPubkey } from './splPubkey';
export { updateSeededSplPubkey } from './seededSplPubkey';
export { lockEndDate } from './lock-end-date';

const rootReducer = combineReducers({
  showPaymentModal: showPaymentModalSlice.reducer,
  presaleEndDate: presaleEndDateSlice.reducer,
  presale: presaleSlice.reducer,
  walletTotal: walletTotalSlice.reducer,
  seededWalletTotal: seededWalletTotalSlice.reducer,
  amountToSend: amountToSendSlice.reducer,
  splPubkey: splPubkeySlice.reducer,
  seededSplPubkey: seededSplPubkeySlice.reducer,
  lockEndDate: lockEndDateSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
