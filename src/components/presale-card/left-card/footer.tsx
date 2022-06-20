import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import store, { useAppSelector } from '../../../store';
import { showPaymentModal } from '../../../reducers';
import { GlowCircle, ThemedFadeButton } from '../..';
import { WalletStatus } from '.';
import {
  updateSeededWalletTotal,
  seededWalletTotal,
} from '../../../reducers/seededWalletTotal';
import {
  PaymentForm,
  PresaleInfo,
  SubmitButton,
  WalletBalance,
  Top,
} from '../../payment-modal/sub-components';
import { styled } from '@mui/system';
import whiteListsJson from '../../../keys/whitelist.json';
import useNotify from './notify';
import { presaleData } from '../../../reducers/presale';
import { getTimeLeft, Time } from '../right-card/timer/util';
import template from '../../../../src/keys/template.json';

import * as splToken from '@solana/spl-token';
import axios from 'axios';
import { TokenAccountType } from '../../../../src/components/payment-modal/sub-components/tokenAccounts';
import { updateWalletTotal, walletTotal } from '../../../reducers/walletTotal';

import { useAppDispatch } from '../../../store';
import { updateSplPubkey } from '../../../reducers';
import { updateSeededSplPubkey } from '../../../reducers';
import { updateAmountToSend } from '../../../reducers/amountToSend';

interface FooterProps {
  walletStatus: WalletStatus;
}

let notify: any;

// TODO: create method that checks against our program
function isWhitelisted(key: string): boolean {
  if (process.env.REACT_APP_WHITELIST === 'enable') {
    const whiteLists = whiteListsJson as string[];
    if (whiteLists.includes(key)) {
      return true;
    }
    return false;
  } else return true;
}
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const S = {
  BoxContainer: styled(Box)`
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 1rem;
    border: #3b3b58 solid 1px;
    background-image: linear-gradient(
      to bottom right,
      #222231b2,
      #000013b2
    ) !important;
    -webkit-backdrop-filter: blur(1rem);
    backdrop-filter: blur(1rem);
    padding-left: 32px;
    padding-right: 32px;
    width: 400px;
  `,
  TopLine: styled('div')`
    margin: 2rem -2rem 0 -2rem;
    background-color: #3b3b58;
    height: 1px;
  `,
};

export default function Footer({ walletStatus }: FooterProps): JSX.Element {
  const [status, setStatus] = useState<Array<string>>(['', '']);
  const dispatch = useAppDispatch();
  const { publicKey } = useWallet();

  const savedPresaleData = useAppSelector(presaleData);
  const [time, setTime] = useState<Time | undefined>(getTimeLeft());
  notify = useNotify();
  const savedSeededWalletTotal = useAppSelector(seededWalletTotal);

  const [allocation, setAllocation] = useState<number>(0);

  useEffect(() => {
    async function getBalance() {
      if (publicKey) {
        const response = await axios({
          url: `https://api.${process.env
            .REACT_APP_SOLANA_NETWORK!}.solana.com`,
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          data: [
            {
              jsonrpc: '2.0',
              id: 1,
              method: 'getTokenAccountsByOwner',
              params: [
                publicKey.toString(),
                {
                  programId: splToken.TOKEN_PROGRAM_ID.toString(),
                },
                {
                  encoding: 'jsonParsed',
                },
              ],
            },
          ],
        });

        const accountArray: TokenAccountType[] = response.data;
        console.log(response);

        if (accountArray.length === 0) {
          dispatch(updateWalletTotal(0));
          return;
        }

        accountArray.map((result) => {
          if (result.error) {
            dispatch(updateWalletTotal(0));
          }
          let values = result.result?.value;
          if (values) {
            values.map((value) => {
              const info = value.account?.data?.parsed?.info;
              const mint = info?.mint;
              if (
                mint &&
                mint === process.env.REACT_APP_USDC_ADDRESS_TESTNET_ID!
              ) {
                dispatch(updateSplPubkey(value.pubkey ?? ''));
                dispatch(updateWalletTotal(info.tokenAmount?.uiAmount ?? 0));
              }
              if (
                mint &&
                mint === process.env.REACT_APP_SEEDED_ADDRESS_TESTNET_ID!
              ) {
                dispatch(updateSeededSplPubkey(value.pubkey ?? ''));
                dispatch(
                  updateSeededWalletTotal(info.tokenAmount?.uiAmount ?? 0)
                );
              }
            });
          }
        });
      } else {
        dispatch(updateWalletTotal(0));
      }
    }

    getBalance();
  }, [publicKey]);

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (status[2] === '0') {
      notify('error', 'Connect your wallet');

      return;
    }

    // if (status[2] === '1') {
    //   notify('error', 'You are not whitelisted');
    //   return;
    // }
    // window.open('https://api.kycaid.com/websdk/forms/eb721e250c6db34d160840c53d4f656773b8?key=fa96de990282504fd50902d0e417bdf811b5', '_blank');
    // setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (!publicKey) {
      setStatus(['bg-yellow-500', 'Connect your wallet.', '0']);
      return;
    } else {
      if (!isWhitelisted(publicKey.toString())) {
        setStatus(['bg-red-500', 'You are not whitelisted.', '1']);
        return;
      }
      // else if (!time) {
      //   setStatus(['bg-red-500', 'Sale ended', '1']);
      //   return;
      // }
      else if (!savedPresaleData.isActive) {
        setStatus(['bg-red-500', 'Sale not started', '1']);
        return;
      }

      if (process.env.REACT_APP_WHITELIST === 'enable')
        setStatus(['bg-green-500', 'You are whitelisted!', '2']);
      else setStatus(['', '', '3']);
    }
  }, [publicKey, walletStatus, savedPresaleData]);

  return (
    <div className="relative bottom-8">
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          {status[2] !== '2' ? (
            <div style={{ display: 'block', textAlign: 'left' }}>
              <p>
                Your allocation:
                <span className="text-green-300"> {allocation} USDC</span>
              </p>
              <p className="text-gray-600">
                Balance: {savedSeededWalletTotal.toFixed(2)} SEEDED
              </p>
            </div>
          ) : (
            <div className="flex">
              <GlowCircle
                color={status[0]}
                status={status[2]}
                className="w-2 h-2 mr-2 mt-1"
              />
              <p className="text-xs">{status[1]}</p>
            </div>
          )}
        </div>
        <div className="pl-8">
          {/* <ThemedFadeButton
            content="KYC"
            onClick={handleOpen}
            className={`text-sm font-medium text-white py-3 px-11 rounded-lg ${!publicKey && 'opacity-50'
              }`}
          /> */}
          {/* ENTER Enter */}
          <ThemedFadeButton
            content="Enter"
            onClick={handleOpen}
            className={`text-sm font-medium text-white py-3 px-11 rounded-lg ${
              !publicKey && 'opacity-50'
            }`}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <S.BoxContainer>
          <S.TopLine></S.TopLine>
          <WalletBalance />
          <PaymentForm />
          <PresaleInfo />
          <SubmitButton />
        </S.BoxContainer>
      </Modal>
    </div>
  );
}
