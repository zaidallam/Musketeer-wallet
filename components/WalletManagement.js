import { useContext, useState, useEffect, useMemo } from 'react';
import { BlockchainContext } from './BlockchainContext';
import Loader from './Loader';
import InitiateTransaction from './InitiateTransaction';
import DepositEther from './DepositEther';
import { useQuadSigWallet } from '../hooks/useMusketeer';
import { ethers } from 'ethers';

export default function WalletManagement({ router, address }) {
    const { isConnected, connectWallet, account, Musketeer, provider, signer } = useContext(BlockchainContext);

    const [isLoading, setIsLoading] = useState(false);
    const [fetchedData, setFetchedData] = useState(true);
    const [walletExists, setWalletExists] = useState(true);
    const [showInitiate, setShowInitiate] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [balance, setBalance] = useState(0);

    const wallet = useQuadSigWallet(isConnected, provider, signer, address);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        if (!router && !router.query) return;

        if (!account && !isConnected) router.push('/');
    }, [account, isConnected, router]);

    const getWalletData = async () => {
        setIsLoading(true);

        try {
            setBalance(ethers.utils.formatEther(await wallet.walletBalance()));
            let transactionIds = (await wallet.getPendingTransactionIds()).map(id => id.toNumber());
            let transactions = [];
            for (let i = 0; i < transactionIds.length; i++) {
                let transaction = await wallet.transactions(transactionIds[i]);
                let viewTransaction = {
                    id: transactionIds[i],
                    from: transaction.from,
                    to: transaction.to,
                    value: ethers.utils.formatEther(transaction.value),
                    signatureCount: transaction.signatureCount
                };

                transactions.push(viewTransaction);
            }
            setPendingTransactions(transactions);
        } catch (e) {
            console.log(e);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        if (!wallet) {
            setWalletExists(false);
            setFetchedData(true);
            return;
        }

        getWalletData();
    }, [wallet]);

    if (fetchedData && !walletExists) return (
        <div className='text-white text-xl'>
            This wallet does not exist.
        </div>
    )

    const deleteTransaction = async (id) => {
        setIsLoading(true);
        
        let tx;
        try {
            tx = await wallet.deleteTransaction(id);
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
        alert("Transaction deleted.");
        getWalletData();
    }

    const signTransaction = async (id) => {
        setIsLoading(true);
        
        let tx;
        try {
            tx = await wallet.signTransaction(id);
        } catch (e) {
            console.log(e);
            alert("Transaction declined. You may not sign a transaction twice or sign a transaction that you created.");
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
        alert("Transaction signed.");
        getWalletData();
    }

    if (fetchedData && walletExists) return (
        <>
            { isLoading ? <Loader /> : null }
            { showInitiate ? <InitiateTransaction setShowInitiate={setShowInitiate} provider={provider} wallet={wallet} getWalletData={getWalletData} /> : null }
            { showDeposit ? <DepositEther setShowDeposit={setShowDeposit} provider={provider} walletAddress={address} getWalletData={getWalletData} /> : null }
            <div className='text-white text-3xl grid gap-3 grid-rows-[min-content_min-content_1fr]'>
                <div>
                    BALANCE: {balance} ETH
                </div>
                <div className='grid grid-cols-2 gap-5'>
                    <button onClick={() => setShowInitiate(true)} className="bg-black hover:opacity-50 text-white py-2 px-4 rounded-lg duration-500 text-xl border-2">Initiate Transaction</button>
                    <button onClick={() => setShowDeposit(true)} className="bg-black hover:opacity-50 text-white py-2 px-4 rounded-lg duration-500 text-xl border-2">Deposit Ether</button> 
                </div>
                <div className='w-full bg-black border-2 rounded-lg grid grid-rows-[min-content_1fr] p-3'>
                    <div>
                        Pending Transactions
                    </div>
                    <div className='flex flex-col'>
                        {pendingTransactions.map(transaction => (
                            <div className='text-base border-2 mb-1 rounded-md grid grid-rows-[min-content_min-content] relative' key={transaction.id}>
                                <div>Transfer: {transaction.value} ETH by {transaction.from.slice(0, 5)}...{transaction.from.slice(-3)} to {transaction.to}</div>
                                <div>
                                    <button onClick={() => signTransaction(transaction.id)} className="bg-black hover:opacity-50 text-white py-1 px-2 rounded-md duration-500 border-2 m-1">Sign</button>
                                    <button onClick={() => deleteTransaction(transaction.id)} className="bg-black hover:opacity-50 text-white py-1 px-2 rounded-md duration-500 border-2 m-1">Delete</button>
                                </div>
                                <span className='absolute left-1 bottom-0'>Signatures: {transaction.signatureCount}/2</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <div className='text-white text-3xl'>
            Fetching Data...
        </div>
    )
}