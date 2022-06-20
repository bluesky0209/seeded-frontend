import { styled } from '@mui/system';
import { LeftCard, RightCard } from '.';

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useEffect } from 'react';
import { useAppDispatch } from '../../store';
import { update } from '../../reducers';
import { useNotify } from '../payment-modal/sub-components';

export interface PresaleProps {
  hardcap: number;
  isActive: boolean;
  isWhitelist: boolean;
  maxAllocation: number;
  minAllocation: number;
  totalRaised: number;
}

const idl = require('../../keys/presale_anchor.json');
const presaleCreatorJson = require('../../keys/presaleCreator.json');
const presaleJson = require('../../keys/presale.json');

let programId = new PublicKey(process.env.REACT_APP_PRESALE_PROGRAM_ID!);

const S = {
  BlurContainer: styled('div')`
    overflow: hidden;
    border-radius: 1rem;
    border: #3b3b58 solid 1px;
    background-image: linear-gradient(
      to bottom right,
      #222231b2,
      #000013b2
    ) !important;
    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);
  `,
  Blur: styled('div')`
    @media (max-width: 720px) {
      flex-direction: column;
    }
  `,
  Right: styled('div')`
    @media (max-width: 720px) {
      margin-left:-2.75rem !important;
    }
  `
};

export default function View(): JSX.Element {
  const dispatch = useAppDispatch();
  const notify = useNotify();

  setInterval(function () {
    getPresaleData();
  }, 1000);

  const getPresaleData = async () => {
    let conn = new Connection(
      `https://api.${process.env.REACT_APP_SOLANA_NETWORK!}.solana.com`,
      'confirmed'
    );

    const arr = Object.values(presaleCreatorJson._keypair.secretKey) as any;
    const secret = new Uint8Array(arr);
    const presaleCreator = Keypair.fromSecretKey(secret);

    const arr2 = Object.values(presaleJson._keypair.secretKey) as any;
    const secret2 = new Uint8Array(arr2);
    const presale = Keypair.fromSecretKey(secret2);

    let wallet = new anchor.Wallet(presaleCreator);
    let provider = new anchor.Provider(
      conn,
      wallet,
      anchor.Provider.defaultOptions()
    );
    const program = new anchor.Program(idl, programId, provider);
    try {
      const account = await program.account.presaleData.fetch(
        presale.publicKey
      );
      const data: PresaleProps = {
        hardcap: +account.hardcap.toString(),
        isActive: account.isActive.toString() === 'true' ? true : false,
        isWhitelist: account.isWhitelist.toString() === 'true' ? true : false,
        maxAllocation: +account.maxAllocation.toString(),
        minAllocation: +account.minAllocation.toString(),
        totalRaised: +account.totalRaised.toString(),
      };
      dispatch(update(data));
    } catch (err: any) {
      // notify('error', `Network Error: ${err?.message}`);
    }
  };

  useEffect(() => {
    getPresaleData();
    return;
  }, []);

  return (
    <div className="flex justify-center items-start">
      <S.BlurContainer>
        <S.Blur className="flex justify-center items-start px-14 pt-16 pb-9">
          <div className="mr-9">
            <LeftCard />
          </div>
          <S.Right className="ml-9">
            <RightCard />
          </S.Right>
        </S.Blur>
      </S.BlurContainer>
    </div>
  );
}
