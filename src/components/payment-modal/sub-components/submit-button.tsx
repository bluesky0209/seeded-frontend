import {
  Connection,
  PublicKey,
  Transaction,
  TransactionSignature,
  Keypair,
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as splToken from '@solana/spl-token';
import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { FadeButton } from '../..';
import { useNotify } from '.';
import {
  amountToSend,
  updateAmountToSend,
} from '../../../reducers/amountToSend';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateWalletTotal, walletTotal } from '../../../reducers/walletTotal';
import { splPubkey } from '../../../reducers/splPubkey';
import * as anchor from '@project-serum/anchor';
import presaleJson from '../../../keys/presale.json';
import whiteListArray from '../../../keys/white-list-client';

const arr = Object.values(presaleJson._keypair.secretKey);
const secret = new Uint8Array(arr);
const presale = Keypair.fromSecretKey(secret);

const idl = require('../../../keys/presale_anchor.json');
let programId = new PublicKey(process.env.REACT_APP_PRESALE_PROGRAM_ID!);

export default function SubmitButton(): JSX.Element {
  const savedWalletTotal = useAppSelector(walletTotal);
  const savedSplPubkey = useAppSelector(splPubkey);
  const dispatch = useAppDispatch();
  const savedAmountToSend = useAppSelector(amountToSend);

  const { connection } = useConnection();
  const { publicKey: sender, sendTransaction } = useWallet();
  const notify = useNotify();

  useEffect(() => { }, [savedWalletTotal, savedAmountToSend]);

  const onClick = useCallback(async () => {
    if (savedAmountToSend === 0 && savedAmountToSend === undefined) {
      notify('error', 'Invalid input value');
      return;
    }

    if (!sender) {
      notify('error', 'Wallet not connected');
      return;
    }

    if (savedWalletTotal < Number(savedAmountToSend)) {
      notify('error', 'Insufficient funds in your wallet');
      return;
    }

    const walletPubkey = sender.toString();

    const conn = new Connection(
      `https://api.${process.env.REACT_APP_SOLANA_NETWORK!}.solana.com`,
      'confirmed'
    );

    let wallet = new anchor.Wallet(presale);
    let provider = new anchor.Provider(
      conn,
      wallet,
      anchor.Provider.defaultOptions()
    );
    const program = new anchor.Program(idl, programId, provider);

    try {
      let signature: TransactionSignature;
      try {
        const tran = program.transaction.buyTokenWithUsdc(
          new anchor.BN(Number(savedAmountToSend) * 1000000),
          {
            accounts: {
              bidder: sender!,
              bidderToken: new PublicKey(savedSplPubkey),
              presalePot: new PublicKey(process.env.REACT_APP_USDC_RECEIVER!),
              presale: presale.publicKey,
              // client: clientKey,
              tokenProgram: splToken.TOKEN_PROGRAM_ID,
            },
          }
        );
        const transaction = new Transaction().add(tran); //.partialSign(client)            //.addSignature(sender!,client);

        transaction.feePayer = sender!;
        transaction.recentBlockhash = (
          await conn.getRecentBlockhash()
        ).blockhash;

        signature = await sendTransaction(transaction, conn);
        notify('info', 'Transaction sent');

        await conn.confirmTransaction(signature, 'processed');
        notify('success', 'Transaction successful');
        const amountLeft = savedWalletTotal - Number(savedAmountToSend);
        dispatch(updateWalletTotal(amountLeft));
        dispatch(updateAmountToSend(0));

        console.log(await program.account.presaleData.fetch(presale.publicKey));

        console.log('end');
      } catch (err: any) {
        notify('error', `Transaction failed: ${err?.message}`);
        console.log('error', `Transaction failed: ${err?.message}`);
        return;
      }
    } catch (error) {
      notify('error', (error as Error).message);
    }
    axios
      .post(`http://localhost:3001/AddList`, {
        savedAmountToSend: savedAmountToSend,
        walletPubkey: walletPubkey,
      })
      .then((res) => {
        console.log('response!');
      });
  }, [sender, sendTransaction, connection, notify, savedAmountToSend]);

  return (
    <FadeButton
      content="Send funds"
      onClick={onClick}
      className="w-full my-10 py-2 mb-12 from-purple-themed to-green-themed text-white"
    />
  );
}
