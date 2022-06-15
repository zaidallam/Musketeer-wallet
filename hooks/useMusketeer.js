import { useMemo } from 'react';
import { ethers } from 'ethers';
import Musketeer from '../build/contracts/Musketeer.json'
import QuadSigWallet from '../build/contracts/QuadSigWallet.json'

export default function useMusketeer(isConnected, provider, signer) {
    return useMemo(() => {
        if (!isConnected || !provider || !signer) {
            return null;
        }

        let contract;

        try {
            contract = new ethers.Contract(Musketeer.networks[Object.keys(Musketeer.networks)[0]].address, Musketeer.abi, signer);
        } catch (ex) {
            console.log(ex);
            alert("There was an error somewhere in the application! See console for details.");
        }

        return contract;
    }, [isConnected, provider, signer]);
}

export function useQuadSigWallet(isConnected, provider, signer, address) {
    return useMemo(() => {
        if (!isConnected || !provider || !signer || !address) {
            return null;
        }

        let contract;

        try {
            contract = new ethers.Contract(address, QuadSigWallet.abi, signer);
        } catch (ex) {
            console.log(ex);
            alert("There was an error somewhere in the application! See console for details.");
        }

        return contract;
    }, [isConnected, provider, signer]);
}