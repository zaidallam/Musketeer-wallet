import { useState, useEffect } from 'react';
import Loader from './Loader';
import { ethers } from 'ethers';

export default function DepositTransaction({ setShowDeposit, provider, walletAddress, getWalletData }) {
    const [depositAmount, setDepositAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const depositEther = async (e) => {
        if (depositAmount == 0) {
            alert("Please enter value greater than 1");
            return;
        }

        if (depositAmount.toString().length > 20) {
            alert("The amount of ether you are trying to deposit is too small or too large");
            return;
        }

        setIsLoading(true);
        
        let tx;
        try {
            tx = await provider.getSigner().sendTransaction({ value: ethers.utils.parseEther(depositAmount.toString()), to: walletAddress });
        } catch {
            setIsLoading(false);
            alert("Something went wrong...");
            return;
        }

        let txReceipt = null
        while (txReceipt == null) {
            txReceipt = await provider.getTransactionReceipt(tx.hash);
            await sleep(2000);
        }

        setIsLoading(false);

        if (!txReceipt || !txReceipt.blockNumber) {
            alert("Something went wrong...");
        }

        setShowDeposit(false);
        alert("Deposited Successfully!");
        getWalletData();
    }

    return (
        <>
            {isLoading ? <Loader /> : null}
            <div className="fixed h-screen w-screen bg-black bg-opacity-50 top-0 left-0 duration-500 z-10" onClick={() => setShowDeposit(false)} />
            <div className="bg-gray-800 fixed rounded-md w-1/4 h-[min-content] left-[37.5%] top-[30%] p-10 grid gap-5 grid-rows-[min-content_min-content_min-content] duration-500 z-10">
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Amount (ETH)</label>
                    <input type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={depositAmount} onChange={(e) => { if (parseFloat(e.target.value) >= 0 || e.target.value == "") setDepositAmount(parseFloat(e.target.value)); }} />
                </div>
                <button onClick={depositEther} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Deposit</button>
                <button onClick={() => setShowDeposit(false)} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Cancel</button>
            </div>
        </>
    )
}