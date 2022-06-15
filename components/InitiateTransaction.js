import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Loader from './Loader';

export default function InitiateTransaction({ setShowInitiate, provider, wallet, getWalletData }) {
    const [sendAddress, setSendAddress] = useState('0x');
    const [sendAmount, setSendAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const sendAddressChanged = (e) => {
        if (!e.target.value) {
            setSendAddress('0x');
            return;
        }

        const regex = /^0x[A-Z\d]?/gi;
        if (e.target.value.match(regex)) setSendAddress(e.target.value);
    }

    const initiateTransaction = async () => {
        const regex = /^0x[a-fA-F0-9]{40}$/;
        if (!regex.test(sendAddress)) {
            alert("Please enter a valid address");
            return;
        }

        if (sendAmount == 0) {
            alert("Please enter value greater than 1");
            return;
        }

        if (sendAmount.toString().length > 20) {
            alert("The amount of ether you are trying to deposit is too small or too large");
            return;
        }

        setIsLoading(true);
        
        let tx;
        try {
            tx = await wallet.initiateTransaction(sendAddress, ethers.utils.parseEther(sendAmount.toString()));
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            return;
        }

        let txReceipt = null;
        while (txReceipt == null) {
            txReceipt = await provider.getTransactionReceipt(tx.hash);
            await sleep(2000);
        }

        setIsLoading(false);

        if (!txReceipt || !txReceipt.blockNumber) {
            alert("Something went wrong...");
        }

        setShowInitiate(false);
        alert("Transaction Initiated Successfully! At least 2 other members must sign the transaction to complete it.");
        getWalletData();
    }

    return (
        <>
            {isLoading ? <Loader /> : null}
            <div className="fixed h-screen w-screen bg-black bg-opacity-50 top-0 left-0 duration-500 z-10" onClick={() => setShowInitiate(false)} />
            <div className="bg-gray-800 fixed rounded-md w-1/4 h-[min-content] left-[37.5%] top-[30%] p-10 grid gap-5 grid-rows-[min-content_min-content_min-content_min-content] duration-500 z-10">
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Recipient Public Key:</label>
                    <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        maxLength={42} value={sendAddress} onChange={sendAddressChanged} />
                </div>
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Amount (ETH)</label>
                    <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={sendAmount} onChange={(e) => { if (parseFloat(e.target.value) >= 0 || e.target.value == "") setSendAmount(parseFloat(e.target.value)); }} />
                </div>
                <button onClick={initiateTransaction} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Initiate Transaction</button>
                <button onClick={() => setShowInitiate(false)} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Cancel</button>
            </div>
        </>
    )
}