import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SelectWallet({ setShowSelect, Musketeer, account }) {
    const [wallets, setWallets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const getWallets = async () => {
        setIsLoading(true);
        let wallets = [];
        try {
            wallets = await Musketeer.getWallets(account);
        } catch (e) {
            console.log(e)
        }

        setIsLoading(false);
        setWallets(wallets);
    }

    useEffect(() => {
        getWallets();
    }, [account]);

    const goToWallet = async (wallet) => {
        router.push(`/${wallet}`);
    }

    return (
        <>
            <div className="fixed h-screen w-screen bg-black bg-opacity-50 top-0 left-0 duration-500 z-10" onClick={() => setShowSelect(false)} />
            <div className="bg-gray-800 fixed rounded-md w-1/4 h-[min-content] left-[37.5%] top-[30%] p-10 grid gap-5 grid-rows-[min-content_min-content_min-content] duration-500 z-10">
                {wallets.length > 0 ? <div className='flex flex-col overflow-auto h-[300px]'>
                    {wallets.map((wallet) => <div onClick={() => goToWallet(wallet)} key={wallet} className='bg-black cursor-pointer hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-base border-2 my-1'>{wallet}</div>)}
                </div> : <div className='text-white text-2xl mb-2'>{isLoading ? "Loading Wallets..." : "No wallets found"}</div>}
                <div className='text-white'>{wallets.length > 0 ? "Select a Wallet From the List Above" : "You Must Create a Wallet First in Order to Access It"}</div>
                <button onClick={() => setShowSelect(false)} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Cancel</button>
            </div>
        </>
    )
}