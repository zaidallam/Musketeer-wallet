import { useContext, useState, useEffect, useMemo } from 'react';
import { BlockchainContext } from './BlockchainContext';
import CreateWallet from './CreateWallet';
import SelectWallet from './FindWallet';

export default function WalletNavigation() {
    const { isConnected, connectWallet, account, Musketeer, provider } = useContext(BlockchainContext);

    const [showCreate, setShowCreate] = useState(false);
    const [showSelect, setShowSelect] = useState(false);

    if (!isConnected) {
        return (
            <div className='text-white text-2xl'>
                <button className="bg-black hover:opacity-50 text-white py-2 px-4 rounded-lg duration-500 text-6xl border-2" onClick={connectWallet}>Connect MetaMask</button>
                <div>Connect Your MetaMask Wallet To Begin Using Musketeer</div>
            </div>
        )
    }

    return (
        <>
            { showCreate ? <CreateWallet setShowCreate={setShowCreate} Musketeer={Musketeer} provider={provider} /> : null }
            { showSelect ? <SelectWallet setShowSelect={setShowSelect} Musketeer={Musketeer} account={account} /> : null }
            <div className='grid gap-8'>
                <div>
                    <button onClick={() => setShowCreate(true)} className="bg-black hover:opacity-50 text-white py-2 px-4 rounded-lg duration-500 text-3xl border-2">Create New Wallet</button>
                </div>
                <div>
                    <button onClick={() => setShowSelect(true)} className="bg-black hover:opacity-50 text-white py-2 px-4 rounded-lg duration-500 text-3xl border-2">Open Existing</button>
                </div>
            </div>
        </>
    )
}