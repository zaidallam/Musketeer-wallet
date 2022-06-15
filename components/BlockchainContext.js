import { createContext } from "react";
import useMetamask from "../hooks/useMetamask";
import useMusketeer, { useQuadSigWallet } from "../hooks/useMusketeer";

export const BlockchainContext = createContext();

export const BlockchainContextProvider = ({children}) => {
    const { isConnected, provider, signer, connectWallet, account } = useMetamask();
    const Musketeer = useMusketeer(isConnected, provider, signer);
    
    const value = {
        isConnected,
        provider,
        signer,
        connectWallet,
        Musketeer,
        account
    }

    return (
        <BlockchainContext.Provider
            value={value}
        >
            {children}
        </BlockchainContext.Provider>
    )
}