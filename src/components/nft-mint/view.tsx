import { Grid, Typography, Snackbar, Alert, Button } from '@mui/material';
import React, { useMemo, useState, useEffect } from 'react';
import ThemedLinkButton from '../shared/button/themed-link';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  getCandyMachineState,
  mintOneToken,
} from './candy-machine';
import { AlertState, formatNumber, getAtaForMint, toDate } from './utils';
import { exact } from 'prop-types';
import { ShimmerButton } from "react-shimmer-effects";
import CounterGroup from './counter-group';

const anch = require('@project-serum/anchor')

const candyMachineId = process.env.REACT_APP_CANDY_MACHINE_ID
  ? new anch.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID)
  : undefined;


const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anch.web3.Connection(rpcHost);

const txTimeout = 30000;

export default function View(): JSX.Element {

  const [state, setState] = useState({
    mobileView: false,
    tabletView: false
  });

  const wallet = useWallet();

  let anchorWallet = {
    publicKey: wallet.publicKey,
    signAllTransactions: wallet.signAllTransactions,
    signTransaction: wallet.signTransaction,
  } as anchor.Wallet;

  React.useEffect(() => {
    try {
      if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
        return
      }
      anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
      } as anchor.Wallet;
      callFirst()
    } catch (ex) {
      console.log(ex)
      return
    }
  }, [wallet]);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const [reaminingItems, setRemainingItems] = useState(10000);
  const [priceItem, setPriceItem] = useState(2);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();

  const [soldOut, setSoldOut] = useState(false);
  const [mintNftCount, setMintNftCount] = useState(1);
  const [successNftState, setSuccessNftState] = useState(false);
  const [notConnectToWallet, setNotConnectToWallet] = useState(true);
  const [isMinting, setIsMinting] = useState(false);

  React.useEffect(() => {
  }, [wallet]);

  React.useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 950
        ? setState((prevState) => ({ ...prevState, mobileView: true, tabletView: false }))
        : window.innerWidth < 1250 ? setState((prevState) => ({ ...prevState, mobileView: false, tabletView: true })) : setState((prevState) => ({ ...prevState, mobileView: false, tabletView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  async function callFirst() {
    if (!anchorWallet) {
      setTimeout(() => {
        if (!wallet || !wallet.publicKey || !wallet.signTransaction) {
          callFirst()
          return
        }
        anchorWallet = {
          publicKey: wallet.publicKey,
          signAllTransactions: wallet.signAllTransactions,
          signTransaction: wallet.signTransaction,
        } as anchor.Wallet
      }, 3000);
      return;
    }
    if (candyMachineId) {
      try {
        console.log("anchorWallet", anchorWallet)
        console.log("candyMachineId", candyMachineId)
        console.log("connection", connection)
        const cndy = await getCandyMachineState(
          anchorWallet,
          candyMachineId,
          connection,
        );
        if (cndy) {
          setNotConnectToWallet(false)
          if (cndy.state.itemsRemaining === 0 || cndy.state.itemsRemaining < 1) {
            setSoldOut(true)
          }
          setRemainingItems(cndy.state.itemsRemaining)
          setPriceItem(1)
        }
        setCandyMachine(cndy);
      } catch (e) {
        console.log('Problem getting candy machine state');
        console.log(e);
      }
    } else {
      console.log('No candy machine detected in configuration.');
    }
  };

  const { mobileView, tabletView } = state;
  let successNftCount = 0
  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let status: any = { err: true };
        for (let i = 0; i < mintNftCount; i++) {
          const mintTxId = (
            await mintOneToken(candyMachine, wallet.publicKey)
          )[0];
          console.log("mintTxId", mintTxId)
          if (mintTxId) {
            status = await awaitTransactionSignatureConfirmation(
              mintTxId,
              txTimeout,
              connection,
              'singleGossip',
              true,
            );
          }

          if (!status?.err) {
            successNftCount += 1
          } else {
            break
          }
        }
        if (!status?.err) {
          setTimeout(() => {
            callFirst()
          }, 5000);
          setAlertState({
            open: true,
            message: `Congratulations! ${successNftCount} Mint succeeded!`,
            severity: 'success',
          });
        } else {
          if (successNftCount > 0) {
            setTimeout(() => {
              callFirst()
            }, 5000);
            setAlertState({
              open: true,
              message: `Congratulations! ${successNftCount} Mint succeeded!`,
              severity: 'success',
            });
          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error',
            });
          }
        }
        successNftCount = 0
      }
    } catch (error: any) {
      successNftCount = 0
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className='dashboard-layout'>
      <main className=''>
        <Grid display="flex" container alignItems="center" justifyContent="center">
          <Grid item xs={mobileView ? 12 : 8}>
            {mobileView && (
              <Grid display="flex" container alignItems="center" className="mint-linear" justifyContent="center" style={{ padding: 30, paddingTop: 50, marginTop: 30, backgroundColor: '#101021', borderColor: '#0CF3A8', borderWidth: 2, borderRadius: 30 }}>
                <Grid item xs={12}>
                  <img src="images/mr_seeded.png" style={{ objectFit: 'contain', marginBottom: 10 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h3" component="div" className="mint-text1" style={{ marginBottom: 10 }}>
                    Seeded Baggie
                  </Typography>
                  <Typography variant="h6" component="div" className="mint-text2" >
                    Embodying the Seeded spirit, the Seeded Baggies Collection boasts the most exclusive Baggies in all of Solana. The aesthetic nature of Baggies makes them the most formidable ally in anyone's NFT collection. Each Seeded Baggie is part of a collection of creatively curated NFTs by Seeded Network.
                  </Typography>
                  <Grid display="flex" container alignItems="center" justifyContent="center" style={{ marginTop: 10 }}>
                    {/* <Grid item xs={12} style={{ marginBottom: 10 }}>
                      {notConnectToWallet && (
                        <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                          <ShimmerButton size="md" />
                        </div>
                      )}
                      {!notConnectToWallet && (
                        <Typography variant="h3" component="div" className="mint-text3">
                          {reaminingItems}
                        </Typography>
                      )}
                      <Typography variant="h6" component="div" className="mint-text4">
                        NFT LEFT
                      </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ marginBottom: 10 }}>
                      {notConnectToWallet && (
                        <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                          <ShimmerButton size="md" />
                        </div>
                      )}
                      {!notConnectToWallet && (
                        <Typography variant="h3" component="div" className="mint-text3">
                          {priceItem} SOL
                        </Typography>
                      )}
                      <Typography variant="h6" component="div" className="mint-text4">
                        PRICE
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <CounterGroup maxValue={reaminingItems} changeCounter={(val) => setMintNftCount(val)} />
                    </Grid>
                    <Grid item xs={6}> */}
                    <ThemedLinkButton
                      content={'Solsea'}
                      onClick={'https://solsea.io/collection/61f823b8449b09d39a119dc1'}
                      className='text-sm text-white py-1 link-button'
                    />
                    <ThemedLinkButton
                      content={'Magic Eden'}
                      onClick={'https://magiceden.io/marketplace/seeded_baggie'}
                      className='text-sm text-white py-2 link-button'
                    />
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
            )}
            {!mobileView && (
              <>

                <img src="images/mint_line2.svg" className="mint-line-1" />
                <img src="images/mint_line1.svg" className="mint-line-2" />
                <img src="images/shade.png" className="mint-background-absolute" />
                <Grid display="flex" container alignItems="center" className="mint-linear" justifyContent="center" style={{ paddingTop: 30, paddingBottom: 30, marginTop: '20%', marginBottom: '20%', opacity: 1, backgroundColor: '#101021', borderColor: '#0CF3A8', borderWidth: 2, borderRadius: 30 }}>
                  <Grid item xs={4}>
                    <Grid display="flex" container alignItems="center" justifyContent="center">
                      <img src="images/mr_seeded.png" style={{ objectFit: 'contain' }} />
                    </Grid>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="inherit" component="div" className="mint-text1">
                      Seeded Baggie
                    </Typography>
                    <Typography variant="inherit" component="div" className="mint-text2" >
                      Embodying the Seeded spirit, the Seeded Baggies Collection boasts the most exclusive Baggies in all of Solana. The aesthetic nature of Baggies makes them the most formidable ally in anyone's NFT collection. Each Seeded Baggie is part of a collection of creatively curated NFTs by Seeded Network              </Typography>
                    <Grid display="flex" container alignItems="center" justifyContent="space-around" style={{ marginTop: 50 }}>
                      {/* <Grid item xs={tabletView ? 6 : 3}>
                        {notConnectToWallet && (
                          <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <ShimmerButton size="sm" />
                          </div>
                        )}
                        {!notConnectToWallet && (
                          <Typography variant="h3" component="div" className="mint-text3">
                            {reaminingItems}
                          </Typography>
                        )}
                        <Typography variant="h6" component="div" className="mint-text4">
                          NFT LEFT
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={tabletView ? 6 : 3}>
                        {notConnectToWallet && (
                          <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <ShimmerButton size="sm" />
                          </div>
                        )}
                        {!notConnectToWallet && (
                          <Typography variant="h3" component="div" className="mint-text3">
                            {priceItem} SOL
                          </Typography>
                        )}
                        <Typography variant="h6" component="div" className="mint-text4">
                          PRICE
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={tabletView ? 6 : 4}>
                        <CounterGroup maxValue={reaminingItems} changeCounter={(val) => setMintNftCount(val)} />
                      </Grid> */}
                      {/* <ThemedFadeButton
                      content={soldOut ? 'Sold Out': 'Mint'} 
                      onClick={soldOut ? null : onMint}
                      className='text-sm text-white py-1 mint-button'
                    /> */}
                      <ThemedLinkButton
                        content={'Solsea'}
                        onClick={'https://solsea.io/collection/61f823b8449b09d39a119dc1'}
                        className='text-sm text-white py-1 link-button'
                      />
                      <ThemedLinkButton
                        content={'Magic Eden'}
                        onClick={'https://magiceden.io/marketplace/seeded_baggie'}
                        className='text-sm text-white py-2 link-button'
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Snackbar
          open={alertState.open}
          autoHideDuration={6000}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          <Alert
            onClose={() => setAlertState({ ...alertState, open: false })}
            severity={alertState.severity}
          >
            {alertState.message}
          </Alert>
        </Snackbar>
      </main>
    </div>
  );
}
