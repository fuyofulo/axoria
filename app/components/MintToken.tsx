"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Input, Button } from 'pixel-retroui';
import {
    TOKEN_2022_PROGRAM_ID,
    createMintToInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddressSync,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getMint
} from "@solana/spl-token";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

const MintTokenComponent = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState<PublicKey | null>(null);

    useEffect(() => {
        // Fetch and set mint address when component mounts
        const storedMintAddress = localStorage.getItem("mintAddress");
        if (storedMintAddress) {
            setMintAddress(new PublicKey(storedMintAddress));
        }
    }, []);

    const mintTokens = async () => {
        const storedMintAddress = localStorage.getItem("mintAddress");

        if (!storedMintAddress || !publicKey || isLoading) return;

        const mintAddress = new PublicKey(storedMintAddress);
        setIsLoading(true);
        setStatus("");

        try {
            const mintInfo = await getMint(connection, mintAddress, undefined, TOKEN_2022_PROGRAM_ID);

            if (!mintInfo.mintAuthority?.equals(publicKey)) {
                throw new Error("Wallet is not mint authority");
            }

            const associatedTokenAddress = getAssociatedTokenAddressSync(
                mintAddress,
                publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            const transaction = new Transaction();
            const instructions: TransactionInstruction[] = [];

            // Check if associated token account exists
            const account = await connection.getAccountInfo(associatedTokenAddress);
            if (!account) {
                instructions.push(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        associatedTokenAddress,
                        publicKey,
                        mintAddress,
                        TOKEN_2022_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    )
                );
            }

            instructions.push(
                createMintToInstruction(
                    mintAddress,
                    associatedTokenAddress,
                    publicKey,
                    parseFloat(amount) * (10 ** mintInfo.decimals),
                    [],
                    TOKEN_2022_PROGRAM_ID
                )
            );

            transaction.add(...instructions);
            const signature = await sendTransaction(transaction, connection);
            console.log(`signature: ${signature}`)

            setStatus("Tokens minted successfully!");
        } catch (error) {
            setStatus(`Error minting token`);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mintAddress) {
        return <p>Loading mint address...</p>; // or a spinner
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="flex justify-center font-bold text-2xl">Mint your token</h1>

            <Input 
                bg="#fefcd0" 
                textColor="black" 
                borderColor="black" 
                className='inputText px-6 py-1' 
                type='number'  
                placeholder="Enter amount to mint" 
                value={amount} 
                disabled={isLoading} 
                min="0.1" 
                step="any"
                onChange={(e) => setAmount(e.target.value)}
            />

            <Button 
                bg="#c381b5" 
                textColor="#fefcd0" 
                shadow="#fefcd0" 
                className="w-60 px-6 py-2" 
                disabled={isLoading}
                onClick={mintTokens}
            >
                Mint Tokens
            </Button>

            {status && (
                <p className={`text-sm ${status.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default MintTokenComponent;
