"use client";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card } from 'pixel-retroui';
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./components/Airdrop";
import { TokenForm } from "./components/TokenForm";
import MintTokenComponent from "./components/MintToken";
import { useEffect, useState } from 'react';
import { Footer } from "./components/Footer";


export default function Home() {

  const [endpoint, setEndpoint] = useState<string | null>(null);
  useEffect(() => {
    // This will only run on the client side after the component mounts
    setEndpoint("https://solana-devnet.g.alchemy.com/v2/PIc1wmnH_QhOEwH3vtddMUwcYluAEHMU");
  }, []);

  if (!endpoint) {
    return <p>Loading...</p>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen flex flex-col justify-between">
          <main className="p-4">
            <Card bg="#c381b5" textColor="#000000" borderColor="#000000" shadowColor="#fefcd0" className="p-4 text-center">
              <h2 className="flex justify-center font-extrabold text-5xl">Axoria</h2>
              <p className="flex justify-center font-semibold text-3xl mt-2">Launch your own solana token</p>
            </Card><br />

            <div className="flex justify-between p-5">
              <WalletMultiButton />
              <WalletDisconnectButton />
            </div><br />

            <div className="grid grid-cols-3">
              <div className="grid col-span-1"><Airdrop /></div>
              <div className="grid col-span-1"><TokenForm /></div>
              <div className="grid col-span-1"><MintTokenComponent/></div>
            </div>
          </main>
          <div className="mb-10 mx-5"><Footer /></div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
