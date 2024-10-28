"use client";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card } from 'pixel-retroui';
import "@solana/wallet-adapter-react-ui/styles.css";
import Airdrop from "./components/Airdrop";
import { TokenForm } from "./components/TokenForm";
import MintTokenComponent from "./components/MintToken";

export default function Home() {
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_SOLANA_ENDPOINT as string}>
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
