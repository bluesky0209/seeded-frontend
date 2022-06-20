import { useEffect, useState } from 'react';
import { Header } from '.';
import { presaleData } from '../../../reducers/presale';
import { useAppSelector } from '../../../store';
import template from '../../../../src/keys/template.json';

import { useWallet } from '@solana/wallet-adapter-react';
export default function PresaleInfo(): React.ReactElement {
  const savedPresaleData = useAppSelector(presaleData);
  const { publicKey } = useWallet();

  useEffect(() => { }, [savedPresaleData]);
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

  return (
    <div className="flex flex-col font-thin text-sm">
      <div className="py-6 text-left pt-6"></div>
      <div className="flex justify-between items-center">
        <p>Your allocation</p>
        <p>{allocation} USDC</p>
      </div>
    </div>
  );
}
