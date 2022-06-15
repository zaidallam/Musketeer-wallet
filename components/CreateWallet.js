import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Loader from './Loader';

export default function CreateWallet({ setShowCreate, Musketeer, provider }) {
    const [member1, setMember1] = useState('0x');
    const [member2, setMember2] = useState('0x');
    const [member3, setMember3] = useState('0x');
    const [isLoading, setIsLoading] = useState(false);

    const inputChanged = (e) => {
        let setMember;

        if (e.target.id == "member1") {
            setMember = setMember1;
        } else if (e.target.id == "member2") {
            setMember = setMember2;
        } else if (e.target.id == "member3") {
            setMember = setMember3;
        }

        if (!e.target.value) {
            setMember('0x');
            return;
        }

        const regex = /^0x[A-Z\d]?/gi;
        if (e.target.value.match(regex)) setMember(e.target.value);
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const createWallet = async () => {
        const regex = /^0x[a-fA-F0-9]{40}$/;
        if (!regex.test(member1) || !regex.test(member2) || !regex.test(member3)) {
            alert("Please enter valid addresses for all three members");
            return;
        }

        setIsLoading(true);
        
        let tx;
        try {
            tx = await Musketeer.createWallet(member1, member2, member3);
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

        setShowCreate(false);
        alert("Wallet Created Successfully!");
    }

    return (
        <>
            {isLoading ? <Loader /> : null}
            <div className="fixed h-screen w-screen bg-black bg-opacity-50 top-0 left-0 duration-500 z-10" onClick={() => setShowCreate(false)} />
            <div className="bg-gray-800 fixed rounded-md w-1/4 h-[min-content] left-[37.5%] top-[30%] p-10 grid gap-5 grid-rows-[min-content_min-content_min-content_min-content_min-content] duration-500 z-10">
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Member 1 Public Key:</label>
                    <input id="member1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        maxLength={42} value={member1} onChange={inputChanged} />
                </div>
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Member 2 Public Key:</label>
                    <input id="member2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        maxLength={42} value={member2} onChange={inputChanged} />
                </div>
                <div>
                    <label className="text-white text-2xl block mb-2 font-medium">Member 3 Public Key:</label>
                    <input id="member3" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        maxLength={42} value={member3} onChange={inputChanged} />
                </div>
                <button onClick={createWallet} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Create Wallet</button>
                <button onClick={() => setShowCreate(false)} className='bg-black hover:opacity-50 text-white py-1 px-4 rounded-lg duration-500 text-xl border-2'>Cancel</button>
            </div>
        </>
    )
}