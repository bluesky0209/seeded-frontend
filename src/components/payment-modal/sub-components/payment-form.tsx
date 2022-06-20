import { styled } from '@mui/system';
import { presaleData } from '../../../reducers/presale';
import {
  amountToSend,
  updateAmountToSend,
} from '../../../reducers/amountToSend';
import { useAppDispatch, useAppSelector } from '../../../store';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import template from '../../../../src/keys/template.json';
interface ValidMessageProps {
  valid: boolean;
}

const S = {
  Container: styled('div')`
    width: 100%;
    height: 72px;
    border: #3b3b58 1px solid;
    border-radius: 14px;
    background-color: #1e1e2e;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
  `,
  Left: styled('div')`
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-right: 20px;
  `,
  Right: styled('div')`
    width: 30%;
    height: 100%;
    border-left: #3b3b58 1px solid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding-right: 20px;
  `,
  Input: styled('input')`
    width: 160px;
    height: 50px;
    text-align: right;
    color: white;
    fontsize: 25px;
    font-weight: bold;
    background-color: transparent;
    border-width: 0px;
    border: none;
    outline-width: 0;
    .middle:focus {
      outline-width: 0;
    }
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::placeholder {
      fontsize: 18px;
      font-weight: normal;
    }
  `,
};

function ValidMessage({ valid }: ValidMessageProps): JSX.Element {
  return (
    <div className="text-xs">
      {valid ? (
        <p className="text-green-500">VALID AMOUNT</p>
      ) : (
        <p className="text-red-500">INVALID AMOUNT</p>
      )}
    </div>
  );
}

export default function PaymentForm(): JSX.Element {
  const dispatch = useAppDispatch();
  const presale = useAppSelector(presaleData);
  const savedAmountToSend = useAppSelector(amountToSend);

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

  useEffect(() => {}, [presale, savedAmountToSend]);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (process.env.REACT_APP_WHITELIST === 'enable') {
      if (Number(value) > allocation) {
        alert('Sorry, you can not put more than allocation.');
        dispatch(updateAmountToSend(allocation));
      } else {
        if (value && value !== '') {
          dispatch(updateAmountToSend(parseFloat(value)));
        } else {
          dispatch(updateAmountToSend(0));
        }
      }
    } else {
      if (value && value !== '') {
        dispatch(updateAmountToSend(parseFloat(value)));
      } else {
        dispatch(updateAmountToSend(0));
      }
    }
  };

  return (
    <>
      <S.Container>
        <S.Left>
          <S.Input
            type="number"
            placeholder="Amount"
            onChange={handleInputChange}
            value={savedAmountToSend}
            max={allocation}
          />
        </S.Left>
        <S.Right>
          <p className="text-lg">USDC</p>
          <p className="text-xs text-gray-500">
            ~${savedAmountToSend.toFixed(2)}
          </p>
        </S.Right>
      </S.Container>
      <ValidMessage
        valid={
          process.env.REACT_APP_WHITELIST === 'enable'
            ? Number(savedAmountToSend) <= allocation &&
              Number(savedAmountToSend) >= 0
            : Number(savedAmountToSend) >= 0
        }
      />
    </>
  );
}
