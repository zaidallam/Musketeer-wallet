import Head from 'next/head'
import Footer from './Footer'
import { BlockchainContext } from './BlockchainContext';
import { useContext } from 'react';

export default function Layout({ children }) {
    const { account } = useContext(BlockchainContext);

    return (
        <>
            <Head>
                <title>Musketeer</title>
                <meta name="description" content="A Quad Signature Ethereum Wallet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="grid grid-rows-[1fr_min-content] min-h-screen bg-gray-800 blur-${blur}">
                { account ? <div className='fixed right-20 top-3 text-white bg-black py-1 px-4 rounded-md border-[1px] cursor-default'>{account}</div> : null }
                {children}
                <Footer />
            </div>
        </>
    )
}