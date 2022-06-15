import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import WalletManagement from '../components/WalletManagement'

export default function Channel() {    
    const router = useRouter();
    const { address } = router.query;
    
    return (
        <div>
            <Head>
                <title>Musketeer</title>
                <meta name="description" content="A Quad Signature Ethereum Wallet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='px-[25%] py-[60px] musketeer-background h-full'>
                <div className='grid grid-rows-[min-content_min-content_1fr] gap-10 text-center h-full'>
                    <img className='w-[200px] m-auto' src="/MusketeerLogoWhite.svg" />
                    <span className='text-white text-lg'>Wallet Address: {address}</span>
                    <WalletManagement address={address} router={router} />
                </div>
            </main>
        </div>
    )
}