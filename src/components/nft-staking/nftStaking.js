import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import logo from '../../assets/logo.svg'
import logo1 from '../../assets/logo1.png'
import logo2 from '../../assets/logo2.png'
import { initGemFarm } from './gem-farm';
import { initGemBank } from './gem-bank';
import { PublicKey } from '@solana/web3.js'; 
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';
import * as anchor from '@project-serum/anchor';
import CircularProgress from '@mui/material/CircularProgress';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Program, Provider, web3, BN } from '@project-serum/anchor';
import { injectStyle } from 'react-toastify/dist/inject-style';
import { useWallet } from '@solana/wallet-adapter-react';
import upImg from '../../assets/up.svg';
import downImg from '../../assets/down.svg';
import axios from "axios"
import {
    getNFTMetadataForMany,
    getNFTsByOwner,
    INFT,
} from './web3/NFTget';
import { getListDiffBasedOnMints, removeManyFromList } from './util';

if (typeof window !== "undefined") {
    injectStyle();
}

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
    width: 925px;
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
const NftImageItem1 = styled.img`
  cursor: pointer;
  width: 81px;
  height: 81px;
  width:81px;
  border:solid 2px #60c5a4;
`
const NftImageItem2 = styled.img`
  cursor: pointer;
  width: 81px;
  height: 81px;
`
const NftItem = styled.div`
  padding:22px;
  display:flex;
`
const ApproveButton2 = styled.button`
  background-color: black;
  color: white;
  font-size: 13px;
  font-family: inter;
  font-weight:bold;
  width: 135px;
  height: 38px;
  background: linear-gradient( 90deg, rgb(114 79 224) 0%, rgb(224 75 193) 100% );
  border-radius: 10px;
  margin-right: 20px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const ApproveButton1 = styled.button`
  background-color: black;
  color: white;
  font-size: 13px;
  font-family: inter;
  font-weight:bold;
  width: 135px;
  height: 38px;
  background: linear-gradient( 90deg, rgb(123 94 218) 0%, rgb(87 189 124) 100% );
  border-radius: 10px;
  margin-right: 20px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
  }
`;
const ApproveButton = styled.button`
  background-color: black;
  color: white;
  font-size: 13px;
  font-family: inter;
  font-weight:bold;
  width: 110px;
  height: 38px;
  background: linear-gradient(
    90deg,
   rgb(255 83 212) 0%, rgb(189 112 236) 100%
  );
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
  color: #00ffb1;
  font-family: inter;
  font-weight: 700;
  margin: 0;
`;
const StakingTitle = styled.p`
  font-size: 12px;
  color: #00ffb1;
  font-weight:bold;
  width: 100%;
  text-align: start;
`;
const StakingTitle1 = styled.p`
  font-size: 15px;
  color: #565670;
  font-weight: bold;
  font-family: inter;
  margin: 5px 0;
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
    height: 540px;
    background-color: #19192a;
    display: flex;
    padding-left: 6rem;
    padding-right: 6rem;
    align-items: center;
    flex-direction:column;
    justify-content: space-around;
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 510px;
        padding-left: 10px !important;
        padding-right: 10px !important;
    }
`
const TransferButton = styled.a`
    cursor:pointer;
    margin-left:1rem;
`
const NftItemContainer = styled.div`
    width: 100%;
    display: -webkit-inline-box;
    background-color: #12121e;
    height: 120px;
    position:relative;
    overflow-y: hidden;
    overflow-x: auto;
    @media (max-width: 1100px) {
        flex-direction: column;
        height: 123px;
        width: 100%;
    }
`
const Transfer = styled.div`
    display:flex;
    width:100%;
    justify-content:center;
    margin-top:30px;
    @media (max-width: 1100px){
        height: 35px;
        margin-top: 11px;
    }
`

const FooterItemContainer = styled.div`
    display: flex;
    width: 100%;
    height: 50px;
    justify-content:center;
    @media (max-width: 1100px) {
    }
`

const LockContainer = styled.div`
    height: 120px;
    width: 100%;
    position: absolute;
    opacity: 0.4;
    background: rgb(0,0,0,0.9);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
`
const imgStyle = {
    width: 49,
    height: 49,
    marginLeft: 20
}

const NftStaking = (props) => {
    const [loading, setLoading] = useState(false);
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("devnet"));
    const wallet = useWallet();
    const { publicKey } = wallet;

    const [farmerIdentity, setFarmerIdentity] = useState('');
    const [farmAcc, setFarmAcc] = useState({});
    const [farmerAcc, setFarmerAcc] = useState({});
    const [farmerState, setFarmerState] = useState('');
    const [availableA, setAvailableA] = useState('');
    const [availableB, setAvailableB] = useState('');

    const [walletNft, setWalletNft] = useState([])
    const [allNft, setAllNft] = useState([])
    const [selectedNft, setSelectedNft] = useState([])

    const [vaultNft, setVaultNft] = useState([])
    const [allVault, setAllVault] = useState([])
    const [selectedVault, setSelectedVault] = useState([])

    const [totalLock, setTotalLock] = useState(0);
    const [toWalletNFTs, setToWalletNFTS] = useState([])
    const [toVaultNFTs, setToVaultNFTs] = useState([])
    const [bank, setBank] = useState('');
    const [stakedAmount, setStakedAmount] = useState(0);
    
    //to get current vault
    const populateVaultNFTs = async (vault) => {
        let gf = await initGemFarm(connection, wallet.adapter);
        const foundGDRs = await gf.fetchAllGdrPDAs(vault);
       
        if (foundGDRs && foundGDRs.length) {
            const mints = foundGDRs.map((gdr) => {
                return { mint: gdr.account.gemMint };
            });
            let currentVaultNFTs = await getNFTMetadataForMany(
                mints,
                connection
            );
            setAllVault(currentVaultNFTs)
            setVaultNft(currentVaultNFTs)
        }
    };

    const populateWalletNFTs = async () => {
        
        const [farmerPDA] = await findFarmerPDA(
            new PublicKey(props.farm.publicKey),
            wallet.publicKey
        );

        let gf = await initGemFarm(connection, wallet.adapter);
        
        let data = await gf.fetchFarmerAcc(farmerPDA);
        let vaultAcc = await gf.fetchVaultAcc(data.vault);
        let whitelistData = await gf.fetchAllWhitelistProofPDAs(
            new PublicKey(vaultAcc.bank)
          );
        if (publicKey) {
            let currentNft = await getNFTsByOwner(
                publicKey,
                connection
            );
            let allowedNft = [];
            for(let i=0;i<currentNft.length;i++){
                let allowNft = whitelistData.filter(item=> (item.account.whitelistType ==1?item.account.whitelistedAddress.toBase58() == currentNft[i].onchainMetadata.updateAuthority:item.account.whitelistedAddress.toBase58() == currentNft[i].mint.toBase58()));
                if(allowNft.length>0){
                    allowedNft.push(currentNft[i])
                }
            }
            console.log(allowedNft, "allow")
            setWalletNft(allowedNft)
            setAllNft(allowedNft)
        }
    }

    const updateAvailableRewards = async () => {
        setAvailableA(farmerAcc.rewardA.accruedReward   
            .sub(farmerAcc.rewardA.paidOutReward)
            .toString());
        setAvailableB(farmerAcc.rewardB.accruedReward
            .sub(farmerAcc.rewardB.paidOutReward)
            .toString());
    };

    const fetchFarn = async () => {
        try {
            let gf = await initGemFarm(connection, wallet.adapter);
            let data = await gf.fetchFarmAcc(new PublicKey(props.farm.publicKey));
            setTotalLock((data.gemsStaked).toNumber())
            setFarmAcc(data);
        } catch (e) {
            console.log(e)
        }
    };

    const fetchFarmer = async () => {
        try {
            const [farmerPDA] = await findFarmerPDA(
                new PublicKey(props.farm.publicKey),
                wallet.publicKey
            );

            let gf = await initGemFarm(connection, wallet.adapter);
            
            let data = await gf.fetchFarmerAcc(farmerPDA);
            setFarmerIdentity(wallet.publicKey.toBase58());

            populateVaultNFTs(data.vault)
            updateVaultState(data.vault)
            setStakedAmount(Number(data.gemsStaked))
            setFarmerAcc(data)
            let state = gf.parseFarmerState(data);
            setFarmerState(state)
            await updateAvailableRewards();

        } catch (e) {
            console.log(e)
        }
    };


    const freshStart = async () => {
        if (wallet.publicKey) {
            setFarmerIdentity(wallet.publicKey.toBase58());
            //reset stuff
            setFarmAcc({});
            setFarmerAcc({});
            setFarmerState('');
            setAvailableA('');
            setAvailableB('');
            try {
                await fetchFarn();
                await fetchFarmer();
            } catch (e) {
                console.log(e);
            }
        }
    };
    const initFarmer = async () => {
        try {
            let gf = await initGemFarm(connection, wallet.adapter);
            let result = await gf.initFarmerWallet(new PublicKey(props.farm.publicKey));
            setLoading(true);
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false)
                    fetchFarmer();
                }
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    };

    const beginStaking = async () => {
        try {
            let gf = await initGemFarm(connection, wallet.adapter);
            let result = await gf.stakeWallet(new PublicKey(props.farm.publicKey))
            setLoading(true);
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false)
                    fetchFarmer();
                }
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    };

    const endStaking = async () => {
        try {
            let gf = await initGemFarm(connection, wallet.adapter);
            let result = await gf.unstakeWallet(new PublicKey(props.farm.publicKey));
            setLoading(true);
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false);
                    fetchFarmer();
                }
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    };

    const claim = async () => {
        try {
            let gf = await initGemFarm(connection, wallet.adapter);
            console.log(new PublicKey(farmAcc.rewardA.rewardMint), new PublicKey(farmAcc.rewardB.rewardMint), "reward")
            let result = await gf.claimWallet(
                new PublicKey(props.farm.publicKey),
                new PublicKey(farmAcc.rewardA.rewardMint),
                new PublicKey(farmAcc.rewardB.rewardMint)
            );
            setLoading(true);
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false);
                    fetchFarmer();
                }
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    };

    const addSingleGem = async (
        gemMint,
        gemSource,
        creator
    ) => {
        let gf = await initGemFarm(connection, wallet.adapter);
        let result = await gf.flashDepositWallet(
            new PublicKey(props.farm.publicKey),
            '1',
            gemMint,
            gemSource,
            creator
        );

    };

    const handleWalletSelected = (e, i) => {
        let nfts = [...walletNft];
        if (e.selected == true) {
            nfts[i].selected = false;
            setWalletNft(nfts)
            let selNfts = [...selectedNft]
            const index = selNfts.indexOf(e);
            selNfts.splice(index, 1);
            setSelectedNft(selNfts)
        } else {
            nfts[i].selected = true;
            setWalletNft(nfts)
            let selNfts = [...selectedNft];
            selNfts.push(e);
            setSelectedNft(selNfts)
        }
    };

    const handleVaultSelected = (e, i) => {
        let vaults = [...vaultNft];
        if (e.select == true) {
            vaults[i].select = false;
            setWalletNft(vaults)
            let selVaults = [...selectedVault]
            const index = selVaults.indexOf(e);
            selVaults.splice(index, 1);
            setSelectedNft(selVaults)

        } else {
            vaults[i].select = true;
            setVaultNft(vaults);
            let selVaults = [...selectedVault]
            selVaults.push(e);
            setSelectedVault(selVaults)
        }
    };

    const updateVaultState = async (vault) => {
        let gf = await initGemFarm(connection, wallet.adapter);
        let vaultAcc = await gf.fetchVaultAcc(vault);
        setBank(vaultAcc.bank)
    };

    const depositGem = async (
        mint,
        creator,
        source
    ) => {
        try {
            let g_b = await initGemBank(connection, wallet.adapter);
            const result = await g_b.depositGemWallet(
                bank,
                farmerAcc.vault,
                new anchor.BN(1),
                mint,
                source,
                creator
            );
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                setLoading(true)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false)
                    Promise.all([populateWalletNFTs(), populateVaultNFTs(farmerAcc.vault)]);
                }
            }, 2000)

        } catch (e) {
            console.log(e)

        }
    };

    const withdrawGem = async (mint) => {
        try {
            let g_b = await initGemBank(connection, wallet.adapter);
            const result = await g_b.withdrawGemWallet(
                bank,
                farmerAcc.vault,
                new anchor.BN(1),
                mint
            );
            let txInterval = setInterval(async () => {
                let url = `https://public-api.solscan.io/transaction/${result.txSig}`
                let data = await axios.get(url)
                setLoading(true)
                if (data.data.status === "Success") {
                    clearInterval(txInterval)
                    setLoading(false)
                    Promise.all([populateWalletNFTs(), populateVaultNFTs(farmerAcc.vault)]);
                }
            }, 2000)

        } catch (e) {
            console.log(e)
        }
    };

    //todo jam into single tx
    const moveNFTsOnChain = async () => {
        for (const nft of toVaultNFTs) {
            const creator = new PublicKey(
                (nft.onchainMetadata).data.creators[0].address
            ); 
            const opts = {
                preflightCommitment: "processed"
            }
            await depositGem(nft.mint, creator, nft.pubkey);
        }
        for (const nft of toWalletNFTs) {
            await withdrawGem(nft.mint);
        }
        setToVaultNFTs([]);
        setToWalletNFTS([]);
    };

    const transferWalletSelected = (type) => {
        if (type == true) {
            let vaults = [...vaultNft];
            let selectNft = [...selectedNft];
            selectNft.forEach((i) => {
                i.selected = false;
            })
            vaults = vaults.concat(selectNft);
            let nfts = [...walletNft];
            let nftdata = removeManyFromList(selectNft, nfts)
            setWalletNft(nftdata)
            setSelectedNft([]);
            setVaultNft(vaults)

            let toVaultNFT = getListDiffBasedOnMints(
                vaults,
                allVault,
            );
            setToVaultNFTs(toVaultNFT)
        } else {
            let nfts = [...walletNft];
            let selectVault = [...selectedVault];
            selectVault.forEach((i) => {
                i.select = false;
            })
            nfts = nfts.concat(selectVault);
            let vaults = [...vaultNft];
            let nftdata = removeManyFromList(selectVault, vaults)
            setVaultNft(nftdata)
            setSelectedVault([]);
            setWalletNft(nfts)

            let toWalletNFT = getListDiffBasedOnMints(
                nfts,
                allNft,
            );
            setToWalletNFTS(toWalletNFT)
        }
    }

    useEffect(async () => {
        if (publicKey) {
            await freshStart()
            populateWalletNFTs()
        }
    }, [publicKey])

    return (
        <BannerContainer>
            {!loading ?
                <StackInfoArea>
                    <HeaderArea>
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                            {props.index == 1 ?
                                <img src={logo1} style={imgStyle} alt="logo" /> :
                                props.index == 2 ?
                                    <img src={logo2} style={imgStyle} alt="logo" /> :
                                    <img src={logo} style={imgStyle} alt="logo" />

                            }
                            <TokenNameArea>
                                < StakingTitle > COLLECTION</StakingTitle>
                                {props.index == 1 ?
                                    <NameArea>SOL BAGGIES</NameArea> : props.index == 2 ?
                                        <NameArea>SHIBA BAGGIES</NameArea> :
                                        <NameArea>SEEDED BAGGIES</NameArea>

                                }
                            </TokenNameArea >
                        </div >
                        <DetailArea>
                            <TokenNameArea1>
                                <StakingTitle1>Total Locked Amount</StakingTitle1>
                                <NameArea1>{totalLock}</NameArea1>
                            </TokenNameArea1>
                            <TokenNameArea1>
                                <StakingTitle1>Staked Amount</StakingTitle1>
                                <NameArea1>
                                    {stakedAmount}
                                </NameArea1>
                            </TokenNameArea1 >
                        </DetailArea >
                    </HeaderArea >
                    <ContentArea>
                        <StakingTitle style={{ color: ' white', marginTop: '20px' }}>YOUR WALLET </StakingTitle>
                        <NftItemContainer>
                            {walletNft.length > 0 ? walletNft.map((item, key) => (
                                item.selected && item.selected == true ?
                                    <NftItem key={key}>
                                        <NftImageItem1 src={item.externalMetadata.image} onClick={() => {
                                            handleWalletSelected(item, key)
                                        }
                                        }
                                        ></NftImageItem1>
                                    </NftItem> :
                                    <NftItem key={key}>
                                        <NftImageItem2 src={item.externalMetadata.image} onClick={() => {
                                            handleWalletSelected(item, key)
                                        }
                                        }
                                        ></NftImageItem2>
                                    </NftItem>

                            )) : ''}
                        </NftItemContainer >
                        {
                            farmerState !== 'staked' && farmerState !== 'pendingCooldown' ?
                                <Transfer>
                                    <TransferButton>
                                        <img src={upImg} onClick={() => transferWalletSelected(false)}></img>
                                    </TransferButton>
                                    <TransferButton>
                                        <img onClick={() => transferWalletSelected(true)} src={downImg}></img>
                                    </TransferButton>
                                </Transfer> : ''
                        }

                        <StakingTitle style={{ color: ' white' }}>YOUR VAULT </StakingTitle>
                        <NftItemContainer>
                            {
                                farmerState === 'staked' || farmerState === 'pendingCooldown' ?
                                    <LockContainer>The vault is locked!</LockContainer > : ''
                            }
                            {vaultNft.length > 0 ? vaultNft.map((item, key) => (
                                item.select && item.select == true ?
                                    <NftItem key={key}>
                                        <NftImageItem1 src={item.externalMetadata.image} onClick={() => {
                                            handleVaultSelected(item, key)
                                        }
                                        }
                                        ></NftImageItem1>
                                    </NftItem> :
                                    <NftItem key={key}>
                                        <NftImageItem2 src={item.externalMetadata.image} onClick={() => {
                                            handleVaultSelected(item, key)
                                        }
                                        }
                                        ></NftImageItem2>
                                    </NftItem>

                            )) : ''}
                        </NftItemContainer >
                        <FooterItemContainer>
                            {(!farmerAcc.vault) ?
                                <ApproveButton1 onClick={() => initFarmer()} >New Farmer</ApproveButton1> : ''
                            }
                            {
                                toWalletNFTs.length > 0 || toVaultNFTs.length > 0 ?
                                    <ApproveButton1 onClick={() => moveNFTsOnChain()} >Move Nfts</ApproveButton1> : ''

                            }
                            {
                                farmerState === 'unstaked' && toWalletNFTs.length == 0 && toVaultNFTs.length == 0  ?
                                    <ApproveButton1 onClick={() => beginStaking()}>Begin Staking</ApproveButton1>
                                    :
                                    ''
                            }
                            {
                                farmerState === 'staked' ?
                                    <ApproveButton2 onClick={() => endStaking()}>End Staking</ApproveButton2 >
                                    :
                                    ''
                            }
                            {
                                farmerState === 'pendingCooldown' ?
                                    <ApproveButton2 onClick={() => endStaking()}>End Cooldown</ApproveButton2 >
                                    :
                                    ''
                            }
                            {
                                farmerAcc.vault ?
                                    <ApproveButton2 onClick={() => claim()}>Claim</ApproveButton2> : ''
                            }
                        </FooterItemContainer>
                    </ContentArea >
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

export default NftStaking
