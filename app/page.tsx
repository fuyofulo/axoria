"use client";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card } from 'pixel-retroui';
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./components/Airdrop";
import { TokenForm } from "./components/TokenForm";
import MintTokenComponent from "./components/MintToken";
import { useEffect, useState } from "react";


export default function Home() {

  const [endpoint, setEndpoint] = useState<string | null>(null);

  useEffect(() => {
    const envEndpoint = process.env.NEXT_PUBLIC_SOLANA_ENDPOINT;
    if (envEndpoint) {
      setEndpoint(envEndpoint);
    } else {
      console.warn("NEXT_PUBLIC_SOLANA_ENDPOINT is not defined");
    }
  }, []);

  if (!endpoint) {
    return <p>Loading...</p>; // or any other fallback UI while endpoint is being loaded
  }
  return (
    <ConnectionProvider endpoint={endpoint ? endpoint : "No endpoint found"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <main className="min-h-screen p-4">
            <Card bg="#c381b5" textColor="#000000" borderColor="#000000" shadowColor="#fefcd0" className="p-4 text-center">
              <h2 className="flex justify-center font-extrabold text-5xl">Axoria</h2>
              <p className="flex justify-center font-semibold text-3xl mt-2">Launch your own solana token</p>
            </Card>

            <div className="flex justify-between p-5">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div>

            <div className="grid grid-cols-3">
              <div className="grid col-span-1"><Airdrop /></div>
              <div className="grid col-span-1"><TokenForm /></div>
              <div className="grid col-span-1"><MintTokenComponent/></div>
            </div>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
