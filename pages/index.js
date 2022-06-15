import Head from 'next/head'
import WalletNavigation from '../components/WalletNavigation'

export default function Home() {
    return (
        <div>
            <Head>
                <title>Musketeer</title>
                <meta name="description" content="A Quad Signature Ethereum Wallet" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className='px-[25%] py-[60px] musketeer-background h-full'>
                <div className='grid grid-rows-[min-content_min-content_1fr] gap-10 text-center place-items-center h-full'>
                    <img className='w-[400px]' src="/MusketeerLogoWhite.svg" />
                    <span className='text-white text-5xl'>Quad Signature Ethereum Wallet</span>
                    <WalletNavigation />
                </div>
            </main>
        </div>
    )
}
