import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import jumpButton from '../assets/jumpButton.svg'
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { injectStyle } from 'react-toastify/dist/inject-style';
import axios from 'axios';
import idl from '../idls/idl.json';
import pool from '../idls/pool.json';
import { convertValueToMeridiem } from '@mui/lab/internal/pickers/time-utils';
import { iteratee } from 'underscore';
import NumberFormat from 'react-number-format';

if (typeof window !== "undefined") {
  injectStyle();
}
const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
const { PublicKey, Connection, SystemProgram, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY } = anchor.web3;
const programID = new PublicKey("STKqapQ5XexMHQ4G5dDwsGMJmGNNwPKFN4FPWyub7tt");
const poolKeys = new PublicKey(new Uint8Array(pool));
const opts = {
  preflightCommitment: "processed"
}
const program_title = "staking_05";
// const pool_seed = "pool_seeded";
const DAILY_REWARD_RATE = 5;
const TIMES = 10 ** 9;

// styled-components 
const BannerContainer = styled.div`
    width: 100%;
    background-color: #101021;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7em 0 0 0;
    @media (max-width: 550px) {
        height: 100%;
    }
    @media (max-width: 720px) {
        padding: 4em 0 0 0;
    }
`
const StackInfoArea = styled.div`
    width: 1186px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    background-color: white;
    margin: 0 auto;
    @media (max-width: 1200px) {
        width: 95%;
    }
    @media (max-width: 720px) {
    }
`
const TokenNameArea = styled.div`
    displa: flex;
    flex-direction: column;
    margin-left: 20px;
`
const TokenNameArea1 = styled.div`
    displa: flex;
    flex-direction: column;
    margin-left: 20px;
    @media (max-width: 720px) {
        margin-left: 0px;
    }
`
const TokenNameArea2 = styled.div`
    displa: flex;
    flex-direction: column;
    margin-left: 20px;
    @media (max-width: 720px) {
        margin-left: 0px;
        margin-right: 40px;
    } 
`
const ValueInputBox = styled.input`
  font-size: 17px;
  font-family: inter;
  padding-left: 15px;
  border-width: 0px;
  width: 50%;
  background-color: #000000;
  color: white;
  &:focus {
    outline: none;
  }
`;
const JumpImage = styled.img`
    width:12px;
    height:10px;
`
const MaxValueButton = styled.button`
  background-color: black;
  color: #0bf3a7;
  font-size: 15px;
  font-family: inter;
  &:hover {
    cursor: pointer;
  }
`;
const DayButton = styled.button`
    background-color:#19192a;
    width: 104px;
    height: 45px;
    border-radius:10px;
`
const ApproveButton = styled.button`
  background-color: black;
  color: black;
  font-size: 15px;
  font-family: inter;
  width: 105px;
  height: 38px;
  background: linear-gradient(
    90deg,
    rgba(124, 83, 255, 1) 0%,
    rgba(112, 236, 157, 1) 100%
  );
  border-radius: 10px;
  margin-right: 20px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const ApproveButton1 = styled.button`
  background-color: black;
  color: black;
  font-size: 15px;
  font-family: inter;
  width: 105px;
  height: 38px;
  background-color: #162f1f;
  border-radius: 10px;
  margin-right: 20px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const NameArea = styled.h2`
  font-size: 19px;
  color: white;
  font-family: inter;
  font-weight: 700;
  margin: 0;
`;
const NameArea1 = styled.h2`
  font-size: 15px;
  color: white;
  font-family: inter;
  font-weight: 700;
  margin: 0;
`;
const StakingTitle = styled.p`
  font-size: 9px;
  display: flex;
  height:1rem;
  color: #00ffb1;
`;
const StakingTitle1 = styled.p`
  font-size: 15px;
  color: #565670;
  font-weight: 600;
  font-family: inter;
  margin: 5px 0 5px;
`;
const HeaderArea = styled.div`
    border-top-right-radius: 13px;
    border-top-left-radius: 13px;
    background: linear-gradient(120deg, rgba(0,0,19,1) 0%, rgba(34,34,49,1) 100%);
    border: 2px solid #3B3B58;
    width: 100%;
    height: 123px;    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 720px) {
        flex-direction: column;
        height: 200px;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    
`
const DetailArea = styled.div`
    width: 60%;
    height: 123px;    
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    @media (max-width: 720px) {
        flex-direction: column;
        width: 100%;
        justify-content: space-between;
    }
`
const ContentArea = styled.div`
    width: 100%;
    height: 450px;
    background-color: #19192a;
    display: flex;
    align-items: center;
    flex-direction:column;
    justify-content: space-around;
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 780px;
    }
`
const DetailItemContainer = styled.div`
    display: flex;
    width: 100%;
    padding-bottom:2rem;
    padding-top:1rem;
    justify-content: space-around;
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 352px;
    }
`
const DetailItemArea = styled.div`
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 500px;
        width: 100%;
        padding: 10px;
    }
`
const ButtonItemArea = styled.div`
    display: flex;
    width: 380px;
    flex-direction: column;
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 500px;
        width: 100%;
        padding:10px;
    }
`
const ActionArea = styled.div`
    width: 380px;
    height: 74px;
    background-color: #000000;
    border-radius: 13px;
    display:flex;
    flex-direction: row;
    align-items:center;
    justify-content: center;
    margin-top: 20px;
    @media (max-width: 1100px) {
        width: 100%;
    }
`
const ButtonArea = styled.div`
    width: 380px;
    height: 74px;
    display:flex;
    flex-direction: row;
    align-items:center;
    justify-content: space-around;
    margin-top: 20px;
    @media (max-width: 1100px) {
        width: 100%;
    }
`
const FeeArea = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    
`
const JumpArea = styled.div`
    display: flex;
    flex-direction: row;
    margin: 0;
    align-items: center;
`
const imgStyle = {
  width: 49,
  height: 49,
  marginLeft: 20
}

const SubArea = styled.div`
    display: flex;
    flex-direction: row;
    width: 50%;
    justify-content: space-around;
    @media (max-width: 720px) {
        width: 70%;
        justify-content: space-between;
    }
`

const BannerContent = () => {
  const [isUser, setIsUser] = useState(0);
  const [stakeType, setStakeType] = useState(14);
  const [walletTokenVal, setWalletTokenVal] = useState(0);
  const [depositeTokenValA, setDepositeTokenValA] = useState(0);
  const [depositeTokenValB, setDepositeTokenValB] = useState(0);
  const [depositeTokenValC, setDepositeTokenValC] = useState(0);
  const [stakingVal, setStakingVal] = useState('');
  const [withdrawVal, setWithdrawVal] = useState('');
  const [lockedValA, setlockedValA] = useState(0);
  const [lockedValB, setlockedValB] = useState(0);
  const [lockedValC, setlockedValC] = useState(0);
  const [rewardAmountA, setRewardAmountA] = useState(0);
  const [rewardAmountB, setRewardAmountB] = useState(0);
  const [rewardAmountC, setRewardAmountC] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dayA, setDayA] = useState(0);
  const [dayB, setDayB] = useState(0);
  const [dayC, setDayC] = useState(0);
  const [timeA, setTimeA] = useState(0);
  const [timeB, setTimeB] = useState(0);
  const [timeC, setTimeC] = useState(0);
  const [minA, setMinA] = useState(0);
  const [minB, setMinB] = useState(0);
  const [minC, setMinC] = useState(0);
  const [secA, setSecA] = useState(0);
  const [secB, setSecB] = useState(0);
  const [secC, setSecC] = useState(0);
  const wallet = useWallet();
  const { publicKey } = wallet;
  const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("mainnet-beta"));
  console.log(wallet, "connec")
  const getProvider = async () => {
    const provider = new anchor.Provider(
      connection, wallet, opts.preflightCommitment,
    );
    console.log(provider, "provider")
    return provider;
  }

  // to get staked amount
  const getStakedBalance = async () => {
    const provider = await getProvider()
    const program = new anchor.Program(idl, programID, provider);
    try {
      const [
        _userPubkey, _userNonce,
      ] = await PublicKey.findProgramAddress(
        [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
        programID
      );
      let poolObject = await program.account.pool.fetch(poolKeys);
      if (poolObject) {
        setlockedValA((poolObject.stakingAmountA.toNumber() / TIMES).toFixed(2));
        setlockedValB((poolObject.stakingAmountB.toNumber() / TIMES).toFixed(2));
        setlockedValC((poolObject.stakingAmountC.toNumber() / TIMES).toFixed(2));
      }
      const accountData = await program.account.user.fetch(_userPubkey);
      const seconds_year = 365 * 24 * 60 * 60;
      const seconds_day = 24 * 60 * 60;
      if (accountData) {
        setIsUser(1);
      }
      const stakedAmountA = (
        accountData.balanceStakedA.toNumber() / TIMES
      );

      const stakedAmountB = (
        accountData.balanceStakedB.toNumber() / TIMES
      );
      const stakedAmountC = (
        accountData.balanceStakedC.toNumber() / TIMES
      );
      if (
        new Date().getTime() / 1000 - accountData.stakeTimeA.toNumber() >
        14 * seconds_day
      ) {
        let stakedAmount =
          ((new Date().getTime() / 1000 -
            accountData.lastUpdateTimeA.toNumber()) *
            ((accountData.balanceStakedA.toNumber() / TIMES) * 0.1)) /
          seconds_year;
        setRewardAmountA(stakedAmount);
      } else {
        setRewardAmountA(0);
        if (stakedAmountA > 0) {
          var timeleft = ((new Date().getTime()) / 1000) - (accountData.stakeTimeA.toNumber());
          console.log(timeleft, (new Date().getTime()) / 1000, accountData.stakeTimeA.toNumber(), "tiemA")
          var days = Math.floor((14 * seconds_day - timeleft) / (60 * 60 * 24));
          var hours = Math.floor(((14 * seconds_day - timeleft) % (60 * 60 * 24)) / (60 * 60));
          var minutes = Math.floor(((14 * seconds_day - timeleft) % (60 * 60)) / (60));
          var seconds = Math.floor(((14 * seconds_day - timeleft) % (60)) / 1000);
          if (minutes > 0) {
            minutes = minutes - 1
          }
          setDayA(days);
          setTimeA(hours);
          setMinA(minutes);
          setSecA(seconds);
          console.log(days, hours, minutes, seconds, "dataA")
        }

      }
      if ((((new Date().getTime()) / 1000) - (accountData.stakeTimeB.toNumber())) > 30 * seconds_day) {
        let stakedAmount = (((new Date().getTime()) / 1000) - (accountData.lastUpdateTimeB.toNumber())) * ((accountData.balanceStakedB.toNumber() / TIMES) * 0.2) / seconds_year;
        setRewardAmountB(stakedAmount);
      }
      if (
        new Date().getTime() / 1000 - accountData.stakeTimeB.toNumber() >
        30 * seconds_day
      ) {
        let stakedAmount =
          ((new Date().getTime() / 1000 -
            accountData.lastUpdateTimeB.toNumber()) *
            ((accountData.balanceStakedB.toNumber() / TIMES) * 0.2)) /
          seconds_year;
        setRewardAmountB(stakedAmount);
      } else {
        setRewardAmountB(0);
        if (stakedAmountB > 0) {
          var timeleft = ((new Date().getTime()) / 1000) - (accountData.stakeTimeB.toNumber());
          console.log(timeleft, (new Date().getTime()) / 1000, accountData.stakeTimeB.toNumber(), "tiemB")
          var days = Math.floor((30 * seconds_day - timeleft) / (60 * 60 * 24));
          var hours = Math.floor(((30 * seconds_day - timeleft) % (60 * 60 * 24)) / (60 * 60));
          var minutes = Math.floor(((30 * seconds_day - timeleft) % (60 * 60)) / (60));
          var seconds = Math.floor(((30 * seconds_day - timeleft) % (60)) / 1000);
          if (minutes > 0) {
            minutes = minutes - 1
          }
          setDayB(days);
          setTimeB(hours);
          setMinB(minutes);
          setSecB(seconds);
          console.log(days, hours, minutes, seconds, "dataB")
        }
      }
      if (
        new Date().getTime() / 1000 - accountData.stakeTimeC.toNumber() >
        90 * seconds_day
      ) {
        let stakedAmount =
          ((new Date().getTime() / 1000 -
            accountData.lastUpdateTimeC.toNumber()) *
            ((accountData.balanceStakedC.toNumber() / TIMES) * 0.3)) /
          seconds_year;
        setRewardAmountC(stakedAmount);
      } else {
        setRewardAmountC(0);
        if (stakedAmountC > 0) {
          var timeleft = ((new Date().getTime()) / 1000) - (accountData.stakeTimeC.toNumber());
          console.log(timeleft, (new Date().getTime()) / 1000, accountData.stakeTimeC.toNumber(), "tiemC")
          var days = Math.floor((90 * seconds_day - timeleft) / (60 * 60 * 24));
          var hours = Math.floor(((90 * seconds_day - timeleft) % (60 * 60 * 24)) / (60 * 60));
          var minutes = Math.floor(((90 * seconds_day - timeleft) % (60 * 60)) / (60));
          var seconds = Math.floor(((90 * seconds_day - timeleft) % (60)) / 1000);
          if (minutes > 0) {
            minutes = minutes - 1
          }
          setDayC(days);
          setTimeC(hours);
          setMinC(minutes);
          setSecC(seconds);
          console.log(days, hours, minutes, seconds, "dataC")
        }
      }
      if (stakedAmountA < Number(stakedAmountA.toFixed(2))) {
        const bal1 = Number(stakedAmountA.toFixed(2)) - 0.01;
        setDepositeTokenValA(bal1);
      } else {
        setDepositeTokenValA(Number(stakedAmountA.toFixed(2)))
      }
      if (stakedAmountB < Number(stakedAmountB.toFixed(2))) {
        const bal2 = Number(stakedAmountB.toFixed(2)) - 0.01;
        setDepositeTokenValB(bal2);
      } else {
        setDepositeTokenValB(Number(stakedAmountB.toFixed(2)))
      }
      if (stakedAmountC < Number(stakedAmountC.toFixed(2))) {
        const bal3 = Number(stakedAmountC.toFixed(2)) - 0.01;
        setDepositeTokenValC(bal3);
      } else {
        setDepositeTokenValC(Number(stakedAmountC.toFixed(2)))
      }
    } catch (e) {
      setIsUser(0);
      console.log(e.message)
      return 0;
    }
  }

  //to get token balance in user's wallet
  const getTokenBalance = async (pubkey) => {
    if (!wallet.publicKey) {
      return 0;
    }
    const provider = await getProvider();
    const program = new anchor.Program(idl, programID, provider);
    const tokens = await provider.connection.getTokenAccountsByOwner(wallet.publicKey, { mint: pubkey });

    if (tokens.value.length == 0) {
      return 0;
    }
    const token = tokens.value.pop();
    const val = (await provider.connection.getTokenAccountBalance(token.pubkey)).value;
    const balance = val.uiAmount;
    if (balance < Number(balance.toFixed(2))) {
      const bal = Number(balance.toFixed(2)) - 0.01;
      console.log(bal, bal);
      setWalletTokenVal(bal)
    }
    else {
      setWalletTokenVal(Number(balance.toFixed(2)));
    }
    return parseFloat(balance.toFixed(2));
  };

  //to create stake account in our pool
  const createStakeAccount = async () => {
    const provider = await getProvider();
    const program = new anchor.Program(idl, programID, provider);
    try {
      const [
        _userPubkey, _userNonce,
      ] = await PublicKey.findProgramAddress(
        [provider.wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
        program.programId
      );
      try {
        await program.rpc.createUser(_userNonce, {
          accounts: {
            pool: poolKeys,
            user: _userPubkey,
            owner: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
        });
        axios.post(`${process.env.REACT_APP_SERVER_URL}staking/create`, { account: wallet.publicKey.toBase58() })
        setLoading(false);
        await getTokenBalance(new PublicKey(process.env.REACT_APP_TOKEN_ID));

      } catch (e) {
        if (
          e.message ==
          'failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.'
        ) {
          toast.error('You need to charge at least 0.00001 sol');
        }
      }
    } catch (e) {
      toast.error('You have to connect your wallet');
    }

  }

  //to stake
  const staking = async () => {
    console.log(stakingVal, walletTokenVal, "how")
    var tstakingVal = Number(stakingVal);
    var twalletTokenVal = Number(walletTokenVal);
    if (tstakingVal === 0 || tstakingVal === '' || tstakingVal === undefined || tstakingVal === null) {
      toast.error('Please input staking token value.');
      return;
    } else if (tstakingVal > twalletTokenVal) {
      toast.error("Sorry, you don't have as many tokens as you choose.");
      return;
    } else {
      // setLoading(true)
      const provider = await getProvider();
      const program = new anchor.Program(idl, programID, provider);
      let poolObject = await program.account.pool.fetch(poolKeys);
      const [
        _poolSigner,
        _nonce,
      ] = await PublicKey.findProgramAddress(
        [poolKeys.toBuffer()],
        programID
      );
      let poolSigner = _poolSigner;
      const [
        _userPubkey, _userNonce,
      ] = await PublicKey.findProgramAddress(
        [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
        programID
      );
      try {
        const data = await program.account.user.fetch(_userPubkey);
      } catch (e) {
        console.log(e.message)
        if (e.message == 'Account does not exist ' + _userPubkey.toBase58()) {
          toast.error('First, You have to create your stake account!');
          await createStakeAccount();
        }
      }
      try {
        const stakingMintObject = new Token(
          provider.connection,
          new PublicKey(process.env.REACT_APP_TOKEN_ID),
          TOKEN_PROGRAM_ID,
          provider.wallet.payer);
        const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
        const stakingPubkey = stakingAccountInfo.address;
        await program.rpc.stake(
          new anchor.BN(tstakingVal * TIMES), new anchor.BN(stakeType),
          {
            accounts: {
              // Stake instance.
              pool: poolKeys,
              stakingVault: poolObject.stakingVault,
              // User.
              user: _userPubkey,
              owner: wallet.publicKey,
              stakeFromAccount: stakingPubkey,
              // Program signers.
              poolSigner,
              // Misc.
              clock: SYSVAR_CLOCK_PUBKEY,
              tokenProgram: TOKEN_PROGRAM_ID,
            },
          }
        );
        axios.post(`${process.env.REACT_APP_SERVER_URL}staking/create`, { account: wallet.publicKey.toBase58() })

        toast.success("Transaction success!")
        // setLoading(false);
        await getStakedBalance();
        await getTokenBalance(new PublicKey(process.env.REACT_APP_TOKEN_ID))
      } catch (err) {
        // setLoading(false);
        console.log("Transaction error: ", err);
      }
    }
  }

  //to unstake
  const unStaking = async () => {
    var twithdrawVal = Number(withdrawVal);
    if (
      twithdrawVal === 0 || twithdrawVal === '' ||
      twithdrawVal === undefined ||
      twithdrawVal === null
    ) {
      toast.error('Please input staking token value.');
      return;
    }
    if (stakeType === 14) {
      if (twithdrawVal > depositeTokenValA) {
        toast.error("Sorry, you don't have as many tokens as you choose.");
        return;
      }
    } else if (stakeType === 30) {
      if (twithdrawVal > depositeTokenValB) {
        toast.error("Sorry, you don't have as many tokens as you choose.");
        return;
      }
    } else {
      if (twithdrawVal > depositeTokenValC) {
        toast.error("Sorry, you don't have as many tokens as you choose.");
        return;
      }
    }

    // setLoading(true)
    const provider = await getProvider()

    const program = new anchor.Program(idl, programID, provider);
    let poolObject = await program.account.pool.fetch(poolKeys);
    const [
      _poolSigner,
      _nonce,
    ] = await PublicKey.findProgramAddress(
      [poolKeys.toBuffer()],
      programID
    );
    let poolSigner = _poolSigner;

    const [
      _userPubkey, _userNonce,
    ] = await PublicKey.findProgramAddress(
      [wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
      programID
    );
    try {
      const stakingMintObject = new Token(
        provider.connection,
        new PublicKey(process.env.REACT_APP_TOKEN_ID),
        TOKEN_PROGRAM_ID,
        provider.wallet.payer);
      const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
      const stakingPubkey = stakingAccountInfo.address;
      await program.rpc.unstake(
        new anchor.BN(twithdrawVal * TIMES), new anchor.BN(stakeType),
        {
          accounts: {
            // Stake instance.
            pool: poolKeys,
            stakingVault: poolObject.stakingVault,
            // User.
            user: _userPubkey,
            owner: wallet.publicKey,
            stakeFromAccount: stakingPubkey,
            // Program signers.
            poolSigner,
            // Misc.
            clock: SYSVAR_CLOCK_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        }
      );
      axios.post(`${process.env.REACT_APP_SERVER_URL}staking/create`, { account: wallet.publicKey.toBase58() })

      toast.success("Transaction success!")

      setLoading(false);
      getStakedBalance();
      getTokenBalance(new PublicKey(process.env.REACT_APP_TOKEN_ID));
    } catch (err) {
      console.log("Transaction error: ", err);
      setLoading(false);
    }

  }

  //to claim reward
  const harvest = async () => {
    if (stakeType === 14) {
      if (
        rewardAmountA == 0 ||
        rewardAmountA === undefined ||
        rewardAmountA === null
      ) {
        toast.error("Sorry, you don't have earned amount now.");
      }
    } else if (stakeType === 30) {
      if (
        rewardAmountB == 0 ||
        rewardAmountB === undefined ||
        rewardAmountB === null
      ) {
        toast.error("Sorry, you don't have earned amount now.");
      }
    } else {
      if (
        rewardAmountC == 0 ||
        rewardAmountC === undefined ||
        rewardAmountC === null
      ) {
        toast.error("Sorry, you don't have earned amount now.");
      }
    }
    try {
      const provider = await getProvider()
      const program = new anchor.Program(idl, programID, provider);

      let poolObject = await program.account.pool.fetch(poolKeys);
      const stakingMintObject = new Token(
        provider.connection,
        new PublicKey(process.env.REACT_APP_TOKEN_ID),
        TOKEN_PROGRAM_ID,
        provider.wallet.payer);
      const stakingAccountInfo = await stakingMintObject.getOrCreateAssociatedAccountInfo(wallet.publicKey);
      const stakingPubkey = stakingAccountInfo.address;

      const [
        _poolSigner,
        _nonce,
      ] = await PublicKey.findProgramAddress(
        [poolKeys.toBuffer()],
        programID
      );
      let poolSigner = _poolSigner;

      const [
        userPubkey, _userNonce,
      ] = await PublicKey.findProgramAddress(
        [provider.wallet.publicKey.toBuffer(), poolKeys.toBuffer()],
        programID
      );

      try {
        await program.rpc.claim(new anchor.BN(stakeType), {
          accounts: {
            // Stake instance.
            pool: poolKeys,
            stakingVault: poolObject.stakingVault,
            // User.
            user: userPubkey,
            owner: provider.wallet.publicKey,
            rewardAAccount: stakingPubkey,
            // Program signers.
            poolSigner,
            // Misc.
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        });
        toast.success("Transaction success!")

        // setLoading(false);
        await getStakedBalance();
        await getTokenBalance(new PublicKey(process.env.REACT_APP_TOKEN_ID))
      } catch (e) {
        console.log(e)
      }
    }
    catch (err) {
      console.log(err)
    }

  }


  useEffect(async () => {
    if (!publicKey) {
      return;
    }
    getTokenBalance(new PublicKey(process.env.REACT_APP_TOKEN_ID));
    getStakedBalance();
  }, [publicKey])

  const setStakingAmount = (val) => {
    if (val != 0) {
      setStakingVal(val)
    } else {
      setStakingVal('')
    }
  }
  const setWithdrawAmount = (val) => {
    if (val != 0) {
      setWithdrawVal(val)
    } else {
      setWithdrawVal('')
    }
  }
  const setStakingMaxAmount = (val) => {
    if (val != 0) {
      setStakingVal(val);
    } else {
      setStakingVal('');
    }
  }
  const setWithdrawMaxAmount = (val) => {
    console.log(val)
    if (val != 0) {
      setWithdrawVal(val);
    } else {
      setWithdrawVal('')
    }
  }
  return (
    <BannerContainer>
      {!loading ?
        <StackInfoArea>
          <HeaderArea>
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
              <img src={logo} style={imgStyle} alt="logo" />
              <TokenNameArea>
                {
                  stakeType === 14 ? depositeTokenValA != 0 ?
                    < StakingTitle > STAKING</StakingTitle> : <StakingTitle></StakingTitle> : ''
                }
                {
                  stakeType === 30 ? depositeTokenValB != 0 ?
                    < StakingTitle > STAKING</StakingTitle> : <StakingTitle></StakingTitle> : ''
                }
                {
                  stakeType === 90 ? depositeTokenValC != 0 ?
                    < StakingTitle > STAKING</StakingTitle> : <StakingTitle></StakingTitle> : ''
                }
                <NameArea>SEEDED</NameArea>
              </TokenNameArea >
            </div >
            <DetailArea>
              <SubArea>
                <TokenNameArea1>
                  <StakingTitle1>APR</StakingTitle1>
                  <NameArea1>{
                    stakeType === 14 ? 10 : stakeType === 30 ? 20 : 30
                  }%</NameArea1>
                </TokenNameArea1>
                <TokenNameArea2>
                  <StakingTitle1>Daily</StakingTitle1>
                  <NameArea1>
                    {stakeType === 14
                      ? (10 / 365).toFixed(3)
                      : stakeType === 30
                        ? (20 / 365).toFixed(3)
                        : (30 / 365).toFixed(3)}
                    %
                  </NameArea1>
                </TokenNameArea2 >
              </SubArea >
              <SubArea>
                <TokenNameArea1>
                  <StakingTitle1>Deposited</StakingTitle1>
                  <NameArea1>
                    {stakeType === 14
                      ?
                      <NumberFormat value={depositeTokenValA} thousandSeparator={true} displayType={'text'}></NumberFormat>
                      : stakeType === 30
                        ? <NumberFormat value={depositeTokenValB} thousandSeparator={true} displayType={'text'}></NumberFormat>
                        : <NumberFormat value={depositeTokenValC} thousandSeparator={true} displayType={'text'}></NumberFormat>
                    }
                  </NameArea1>
                </TokenNameArea1 >
                <TokenNameArea1>
                  <StakingTitle1>Total locked</StakingTitle1>
                  <NameArea1>
                    {
                      stakeType === 14
                        ? <NumberFormat value={lockedValA} thousandSeparator={true} displayType={'text'}></NumberFormat>
                        : stakeType === 30
                          ? <NumberFormat value={lockedValB} thousandSeparator={true} displayType={'text'}></NumberFormat>
                          : <NumberFormat value={lockedValC} thousandSeparator={true} displayType={'text'}></NumberFormat>
                    }
                  </NameArea1 >
                </TokenNameArea1 >
              </SubArea >
            </DetailArea >
          </HeaderArea >
          {!isMobile ?
            <ContentArea>
              <DetailItemContainer>
                <DetailItemArea>
                  <StakingTitle1 style={{ color: ' white', display: 'flex' }}>Deposit </StakingTitle1>
                  <ActionArea>
                    <ValueInputBox
                      value={stakingVal}
                      onChange={(e) => {
                        setStakingAmount(e.target.value);
                      }}
                      type="number"
                      placeholder="0"
                    ></ValueInputBox>
                    <MaxValueButton
                      onClick={() => setStakingMaxAmount(walletTokenVal)}
                    >
                      MAX
                    </MaxValueButton>
                    <ApproveButton onClick={staking}>Deposit</ApproveButton>
                  </ActionArea >
                  <FeeArea>
                    <StakingTitle1 style={{ margin: 0, width: '70%', fontSize: 12, textAlign: 'start' }}>In your wallet: <span style={{ color: ' white' }}><NumberFormat value={walletTokenVal} thousandSeparator={true} displayType={'text'}></NumberFormat>&nbsp;SEEDED</span></StakingTitle1>
                    <StakingTitle1 style={{ margin: 0, width: '30%', fontSize: 12, textAlign: 'end' }}>Deposit Fee: <span style={{ color: ' white' }}>0 %</span></StakingTitle1>
                  </FeeArea>
                </DetailItemArea >
                <ButtonItemArea>
                  <StakingTitle1 style={{ color: ' white', textAlign: 'start' }}>Lock duration</StakingTitle1>
                  <ButtonArea>
                    {
                      stakeType === 14 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(14);
                          }}
                        >
                          14 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(14);
                          }}
                        >
                          14 Days
                        </DayButton>
                      )
                    }
                    {
                      stakeType === 30 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(30);
                          }}
                        >
                          30 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(30);
                          }}
                        >
                          30 Days
                        </DayButton>
                      )
                    }
                    {
                      stakeType === 90 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(90);
                          }}
                        >
                          90 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(90);
                          }}
                        >
                          90 Days
                        </DayButton>
                      )
                    }
                  </ButtonArea >
                  <FeeArea>
                    <StakingTitle1 style={{ margin: 0, width: '50%', fontSize: 12, textAlign: 'start' }}>APR: <span style={{ color: ' #71dca6' }}>{
                      stakeType === 14 ?
                        10 : stakeType === 30 ?
                          20 : 30
                    }&nbsp;%</span></StakingTitle1>
                    <StakingTitle1 style={{ margin: 0, width: '50%', fontSize: 12, textAlign: 'end' }}>Withdrawal Penalty: <span style={{ color: 'red' }}>25%</span></StakingTitle1>
                  </FeeArea>
                </ButtonItemArea >

              </DetailItemContainer >
              <DetailItemContainer>
                <DetailItemArea>
                  <StakingTitle1 style={{ color: 'white', display: 'flex' }}>Withdrawal</StakingTitle1>
                  <ActionArea>
                    <ValueInputBox
                      value={withdrawVal}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      type="number"
                      placeholder="0"
                    ></ValueInputBox>
                    {
                      stakeType === 14 ? (
                        <MaxValueButton
                          onClick={() => {
                            setWithdrawMaxAmount(depositeTokenValA);
                          }}
                        >
                          MAX
                        </MaxValueButton>
                      ) : stakeType === 30 ? (
                        <MaxValueButton
                          onClick={() => {
                            setWithdrawMaxAmount(depositeTokenValB);
                          }}
                        >
                          MAX
                        </MaxValueButton>
                      ) : (
                        <MaxValueButton
                          onClick={() => {
                            setWithdrawMaxAmount(depositeTokenValC);
                          }}
                        >
                          MAX
                        </MaxValueButton>
                      )
                    }
                    {
                      stakeType === 14 ? (
                        depositeTokenValA != 0 ? (
                          <ApproveButton onClick={unStaking}>
                            Withdraw
                          </ApproveButton>
                        ) : (
                          <ApproveButton1 onClick={unStaking}>
                            Withdraw
                          </ApproveButton1>
                        )
                      ) : (
                        ''
                      )
                    }
                    {
                      stakeType === 30 ? (
                        depositeTokenValB != 0 ? (
                          <ApproveButton onClick={unStaking}>
                            Withdraw
                          </ApproveButton>
                        ) : (
                          <ApproveButton1 onClick={unStaking}>
                            Withdraw
                          </ApproveButton1>
                        )
                      ) : (
                        ''
                      )
                    }
                    {
                      stakeType === 90 ? (
                        depositeTokenValC != 0 ? (
                          <ApproveButton onClick={unStaking}>
                            Withdraw
                          </ApproveButton>
                        ) : (
                          <ApproveButton1 onClick={unStaking}>
                            Withdraw
                          </ApproveButton1>
                        )
                      ) : (
                        ''
                      )
                    }
                  </ActionArea >
                  <FeeArea>
                    <StakingTitle1
                      style={{
                        margin: 0,
                        width: '50%',
                        fontSize: 12,
                        textAlign: 'start',
                      }}
                    >
                      Deposited:{' '}
                      <span style={{ color: ' white' }}>
                        {stakeType === 14
                          ? <NumberFormat value={depositeTokenValA} thousandSeparator={true} displayType={'text'}></NumberFormat>
                          : stakeType === 30
                            ? <NumberFormat value={depositeTokenValB} thousandSeparator={true} displayType={'text'}></NumberFormat>
                            : <NumberFormat value={depositeTokenValC} thousandSeparator={true} displayType={'text'}></NumberFormat>}
                        &nbsp;SEEDED
                      </span>
                    </StakingTitle1>
                    <StakingTitle1
                      style={{
                        margin: 0,
                        width: '50%',
                        fontSize: 12,
                        textAlign: 'start',
                      }}
                    >
                      Lock time left:{' '}
                      <span style={{ color: ' #71dca6' }}>
                        {stakeType === 14
                          ? `${dayA} D:${timeA} H:${minA} M`
                          : stakeType === 30
                            ? `${dayB} D:${timeB} H:${minB} M`
                            : `${dayC} D:${timeC} H:${minC} M`}
                      </span>
                    </StakingTitle1>
                  </FeeArea>
                </DetailItemArea >
                <DetailItemArea>
                  <StakingTitle1 style={{ display: 'flex', color: ' white' }}>SEEDED Earned</StakingTitle1>
                  <ActionArea>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {
                        stakeType === 14 ? (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountA}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        ) : stakeType === 30 ? (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountB}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        ) : (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountC}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        )
                      }
                      {/* <p style={{ margin: 0, fontFamily: 'inter', fontSize: 12, color: '#565670', paddingLeft: 20 }}>~420.156 USD</p> */}
                    </div >
                    {stakeType === 14 ? rewardAmountA != 0 ?
                      <ApproveButton onClick={harvest}>Harvest</ApproveButton> :
                      <ApproveButton1 onClick={harvest}>Harvest</ApproveButton1> : ''
                    }
                    {
                      stakeType === 30 ? rewardAmountB != 0 ?
                        <ApproveButton onClick={harvest}>Harvest</ApproveButton> :
                        <ApproveButton1 onClick={harvest}>Harvest</ApproveButton1> : ''
                    }
                    {
                      stakeType === 90 ? rewardAmountC != 0 ?
                        <ApproveButton onClick={harvest}>Harvest</ApproveButton> :
                        <ApproveButton1 onClick={harvest}>Harvest</ApproveButton1> : ''
                    }
                  </ActionArea >
                  <FeeArea style={{ height: 15 }} />
                </DetailItemArea >

              </DetailItemContainer >
            </ContentArea > :
            <ContentArea>
              <DetailItemContainer>
                <ButtonItemArea>
                  <StakingTitle1 style={{ color: ' white', textAlign: 'start' }}>Lock duration</StakingTitle1>
                  <ButtonArea>
                    {
                      stakeType === 14 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(14);
                          }}
                        >
                          14 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(14);
                          }}
                        >
                          14 Days
                        </DayButton>
                      )
                    }
                    {
                      stakeType === 30 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(30);
                          }}
                        >
                          30 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(30);
                          }}
                        >
                          30 Days
                        </DayButton>
                      )
                    }
                    {
                      stakeType === 90 ? (
                        <DayButton
                          style={{ color: 'white', border: 'solid 2.5px #71dca6' }}
                          onClick={() => {
                            setStakeType(90);
                          }}
                        >
                          90 Days
                        </DayButton>
                      ) : (
                        <DayButton
                          style={{ color: 'grey', border: 'solid 1px grey' }}
                          onClick={() => {
                            setStakeType(90);
                          }}
                        >
                          90 Days
                        </DayButton>
                      )
                    }
                  </ButtonArea >
                  <FeeArea>
                    <StakingTitle1 style={{ margin: 0, width: '50%', fontSize: 12, textAlign: 'start' }}>APR: <span style={{ color: ' #71dca6' }}>{
                      stakeType === 14 ?
                        10 : stakeType === 30 ?
                          20 : 30
                    }&nbsp;%</span></StakingTitle1>
                    <StakingTitle1 style={{ margin: 0, width: '50%', fontSize: 12, textAlign: 'end' }}>Withdrawal Penalty: <span style={{ color: ' red' }}>25%</span></StakingTitle1>
                  </FeeArea>
                </ButtonItemArea >
                <DetailItemArea>
                  <StakingTitle1 style={{ color: ' white', display: 'flex' }}>Deposit </StakingTitle1>
                  <ActionArea>
                    <ValueInputBox value={stakingVal} onChange={(e) => { setStakingAmount(e) }} type="number" placeholder="0"></ValueInputBox>
                    <MaxValueButton onClick={() => setStakingMaxAmount(walletTokenVal)} >MAX</MaxValueButton>
                    <ApproveButton onClick={staking}>Deposit</ApproveButton>
                  </ActionArea>
                  <FeeArea>
                    <StakingTitle1 style={{ margin: 0, width: '70%', fontSize: 12, textAlign: 'start' }}>In your wallet: <span style={{ color: ' white' }}>{walletTokenVal}&nbsp;SEEDED</span></StakingTitle1>
                    <StakingTitle1 style={{ margin: 0, width: '30%', fontSize: 12, textAlign: 'end' }}>Deposit Fee: <span style={{ color: ' white' }}>0 %</span></StakingTitle1>
                  </FeeArea>
                </DetailItemArea>
              </DetailItemContainer >
              <DetailItemContainer>
                <DetailItemArea>
                  <StakingTitle1 style={{ color: 'white', display: 'flex' }}>Withdrawal</StakingTitle1>
                  <ActionArea>
                    <ValueInputBox value={withdrawVal} onChange={(e) => setWithdrawAmount(e)} type="number" placeholder="0"></ValueInputBox>
                    {
                      stakeType === 14 ?
                        <MaxValueButton onClick={() => { setWithdrawMaxAmount(depositeTokenValA) }}>MAX</MaxValueButton> :
                        stakeType === 30 ?
                          <MaxValueButton onClick={() => { setWithdrawMaxAmount(depositeTokenValB) }}>MAX</MaxValueButton> :
                          <MaxValueButton onClick={() => { setWithdrawMaxAmount(depositeTokenValC) }}>MAX</MaxValueButton>
                    }
                    {stakeType === 14 ? depositeTokenValA != 0 ?
                      <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                      <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                    {stakeType === 30 ? depositeTokenValB != 0 ?
                      <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                      <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                    {stakeType === 90 ? depositeTokenValC != 0 ?
                      <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                      <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                  </ActionArea>
                  <FeeArea>
                    <StakingTitle1
                      style={{
                        margin: 0,
                        width: '50%',
                        fontSize: 12,
                        textAlign: 'start',
                      }}
                    >
                      Deposited:{' '}
                      <span style={{ color: ' white' }}>
                        {stakeType === 14
                          ? depositeTokenValA
                          : stakeType === 30
                            ? depositeTokenValB
                            : depositeTokenValC}
                        &nbsp;SEEDED
                      </span>
                    </StakingTitle1>
                    <StakingTitle1
                      style={{
                        margin: 0,
                        width: '50%',
                        fontSize: 12,
                        textAlign: 'start',
                      }}
                    >
                      Lock time left:{' '}
                      <span style={{ color: ' #71dca6' }}>
                        {stakeType === 14
                          ? `${dayA} D:${timeA} H:${minA} M`
                          : stakeType === 30
                            ? `${dayB} D:${timeB} H:${minB} M`
                            : `${dayC} D:${timeC} H:${minC} M`}
                      </span>
                    </StakingTitle1>
                  </FeeArea >
                </DetailItemArea >
                <DetailItemArea>
                  <StakingTitle1 style={{ display: 'flex', color: ' white' }}>SEEDED Earned</StakingTitle1>
                  <ActionArea>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {
                        stakeType === 14 ? (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountA}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        ) : stakeType === 30 ? (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountB}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        ) : (
                          <ValueInputBox
                            disabled="disabled"
                            value={rewardAmountC}
                            type="number"
                            style={{ width: '100%' }}
                            placeholder="0"
                          ></ValueInputBox>
                        )
                      }
                      {/* <p style={{ margin: 0, fontFamily: 'inter', fontSize: 12, color: '#565670', paddingLeft: 20 }}>~420.156 USD</p> */}
                    </div >
                    {stakeType === 14 ? rewardAmountA != 0 ?
                      <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                      <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                    {
                      stakeType === 30 ? rewardAmountB != 0 ?
                        <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                        <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                    {
                      stakeType === 90 ? rewardAmountC != 0 ?
                        <ApproveButton onClick={unStaking}>Withdraw</ApproveButton> :
                        <ApproveButton1 onClick={unStaking}>Withdraw</ApproveButton1> : ''
                    }
                  </ActionArea >
                  <FeeArea style={{ height: 15 }} />
                </DetailItemArea >

              </DetailItemContainer >
            </ContentArea >
          }
        </StackInfoArea > :
        <div style={{ position: 'absolute', zIndex: 9999, width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <CircularProgress color="success" />
          <p style={{ marginTop: 20, fontSize: 18 }}>
            Waiting for transaction...
          </p>
        </div >
      }
      <ToastContainer />
    </BannerContainer >
  );
};

export default BannerContent
