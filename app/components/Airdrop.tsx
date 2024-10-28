"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from 'pixel-retroui';
import { Input } from 'pixel-retroui';

export function Airdrop() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const [isAirdropping, setIsAirdropping] = useState(false);

    const sendAirdropToUser = async () => {
        if (!publicKey) {
            setStatus("No wallet connected!");
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setStatus("Please enter a valid amount.");
            return;
        }

        setIsAirdropping(true);
        setStatus("Requesting airdrop...");

        try {
            await connection.requestAirdrop(
                publicKey,
                parsedAmount * LAMPORTS_PER_SOL
            );
            setStatus(`Airdropped ${parsedAmount} SOL successfully!`);
        } catch (error) {
            console.error("Airdrop failed:", error);
            setStatus("Airdrop failed. Please try again.");
        } finally {
            setIsAirdropping(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
           <h1 className="font-bold text-2xl">Airdrop some solana</h1>

            <Input bg="#fefcd0" textColor="black" borderColor="black" className='inputText px-6 py-1' type='number' placeholder="Enter airdrop amount" value={amount} disabled={isAirdropping}
                onChange={(e) => setAmount(e.target.value)}/>

            <Button bg="#c381b5" textColor="#fefcd0" shadow="#fefcd0" className="w-60 px-6 py-2" onClick={sendAirdropToUser} 
                disabled={isAirdropping} >{isAirdropping ? "Airdropping..." : "Request Airdrop"}</Button>
            {status && <p className="text-sm text-green-500">{status}</p>}
        </div>
    );
}

export default Airdrop;
