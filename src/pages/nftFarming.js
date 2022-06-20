import React, { useState, useEffect } from 'react'
import NftStaking from '../components/nft-staking/nftStaking'
import { initGemFarm } from '../components/nft-staking/gem-farm';
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

const NftFarm = () => {
    const [farmPool, setFarmPool] = useState([]);
    const connection = new anchor.web3.Connection(anchor.web3.clusterApiUrl("mainet-beta"));
    const wallet = useWallet();
    const { publicKey } = wallet;
    const getFarmPool = async () => {
        console.log("nftFarm")
        let gf = await initGemFarm(connection, wallet.adapter);
        let foundFarms = await gf.fetchAllFarmPDAs(new PublicKey('AzurEAAY66JwU6Rxntp4hmSryetBFuS8hvBHRSR4Tdcp'));
        setFarmPool(foundFarms);
    }
    useEffect(() => {
        getFarmPool();
    }, [])
    return (
        <div>
            {
                farmPool.map((item, key) => (
                    <NftStaking farm={item} index={key} key={key}></NftStaking>
                ))
            }
        </div>
    )
}

export default NftFarm
