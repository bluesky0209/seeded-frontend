import { useEffect, useState } from 'react';
import { Header } from '.';
import { useWallet } from '@solana/wallet-adapter-react';
import * as splToken from '@solana/spl-token';
import axios from 'axios';
import { TokenAccountType } from './tokenAccounts';
import { updateWalletTotal, walletTotal } from '../../../reducers/walletTotal';
import {
  updateSeededWalletTotal,
  seededWalletTotal,
} from '../../../reducers/seededWalletTotal';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateSplPubkey } from '../../../reducers';
import { updateSeededSplPubkey } from '../../../reducers';
import { presaleData } from '../../../reducers/presale';
import { updateAmountToSend } from '../../../reducers/amountToSend';
import template from '../../../../src/keys/template.json';
export default function WalletBalance(): JSX.Element {
  const dispatch = useAppDispatch();
  const savedWalletTotal = useAppSelector(walletTotal);
  const savedSeededWalletTotal = useAppSelector(seededWalletTotal);
  const savedPresaleData = useAppSelector(presaleData);
  const { publicKey } = useWallet();

  const [allocation, setAllocation] = useState<number>(0);
  useEffect(() => {
    getAllocation();
  });
  const getAllocation = () => {
    template.map((item, index) => {
      if (publicKey?.toString() === item.wallet) {
        let allocation = Number(item.allocation);
        setAllocation(allocation);
      }
    });
  };

  useEffect(() => {}, [savedWalletTotal]);

  const walletBalanceClicked = () => {
    if (process.env.REACT_APP_WHITELIST === 'enable') {
      if (savedWalletTotal > allocation) {
        alert('Sorry, you can not put more than allocation.');
        dispatch(updateAmountToSend(allocation));
      } else {
        dispatch(updateAmountToSend(savedWalletTotal));
      }
    } else {
      dispatch(updateAmountToSend(savedWalletTotal));
    }
  };

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="flex justify-between items-center mt-10">
      <Header>AMOUNT</Header>
      <div className="flex text-sm">
        <p className="pr-2">Wallet Balance:</p>
        <button onClick={walletBalanceClicked}>
          <p className="flex text-green-500">
            {savedWalletTotal.toFixed(2)} USDC
          </p>
        </button>
      </div>
    </div>
  );
}
