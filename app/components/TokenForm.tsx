"use client";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Button, Input, Popup } from 'pixel-retroui';
import { useState } from 'react';
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType } from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { SystemProgram, Transaction, Keypair } from '@solana/web3.js';


export function TokenForm() {
    const wallet = useWallet();
    const { connection } = useConnection();

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<string>("");
    const [isLoading, ] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mintAddress, setMintAddress] = useState("");
    const [decimals] = useState(9); // Default to 9 decimals

    async function createToken() {
        if (!connection || !wallet.publicKey) {
            console.error("Connection is not established.");
            return;
        }

        const mintKeypair = Keypair.generate();

        const metadata = {
            mint: mintKeypair.publicKey,
            name: name,
            symbol: symbol,
            uri: imageUrl,
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            })
        );

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        setStatus("Transaction sent, waiting for confirmation...");

        try {
            const signature = await wallet.sendTransaction(transaction, connection);
            console.log("Transaction sent, signature:", signature);

            // Confirm the transaction with retry logic
            const isConfirmed = await confirmTransaction(signature);
            if (isConfirmed) {
                console.log("Token created successfully!");
                console.log("Token Details:");
                console.log("Mint Address:", mintKeypair.publicKey.toBase58());
                console.log("Name:", name);
                console.log("Symbol:", symbol);
                console.log("Image URI:", imageUrl);
                console.log("Mint Authority:", wallet.publicKey.toBase58());
                setStatus("Token created successfully!");

                // Store the mint address in localStorage

                if(localStorage.setItem('mintAddress', mintKeypair.publicKey.toBase58())!) {
                    console.log("mint address wasnt stored in the local storage")
                } else {
                    console.log(`mint address stored successfully: ${mintKeypair.publicKey.toBase58()}`)
                }

                setMintAddress(mintKeypair.publicKey.toBase58()); // Set the mint address for popup
                setIsPopupOpen(true); // Open the success popup
            }
        } catch (error) {
            console.error("Token creation failed:", error);
            setStatus("Token creation failed. Please try again.");
        }
    }

    const confirmTransaction = async (
        signature: string,
        retries = 0,
        maxRetries = 10,
        retryDelay = 2000
    ): Promise<boolean> => {
        while (retries < maxRetries) {
            try {
                // Fetch the transaction status
                const statusResponse = await connection.getSignatureStatuses([signature], {
                    searchTransactionHistory: true,
                });

                const confirmationStatus = statusResponse.value[0]?.confirmationStatus;
                const error = statusResponse.value[0]?.err;

                // If confirmed or finalized without error, transaction is successful
                if ((confirmationStatus === "confirmed" || confirmationStatus === "finalized") && !error) {
                    console.log("Transaction confirmed successfully.");
                    return true;
                }

                // If there’s an error in the transaction, fail early
                if (error) {
                    console.error("Transaction failed:", error);
                    throw new Error("Transaction encountered an error.");
                }

                // Wait before retrying
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                retries += 1;
                console.log(`Retrying confirmation... Attempt ${retries}`);

            } catch (error) {
                console.error("Error checking transaction status:", error);
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
                retries += 1;
            }
        }

        console.error("Transaction confirmation ultimately failed after maximum retries.");
        throw new Error("Transaction confirmation failed.");
    };

    const closePopup = () => setIsPopupOpen(false);

    return (
        <div className="flex justify-center items-center flex-col gap-3">
            <h1 className="flex justify-center font-bold text-2xl">Enter token metadata</h1>

            <Input 
                bg="#fefcd0" 
                textColor="black" 
                borderColor="black" 
                className='inputText px-6 py-2' 
                type='text' 
                placeholder='Name' 
                value={name} 
                onChange={(e) => setName(e.target.value)}
            />

            <Input 
                bg="#fefcd0" 
                textColor="black" 
                borderColor="black" 
                className='inputText px-6 py-2' 
                type='text' 
                placeholder='Symbol' 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />

            <Input 
                bg="#fefcd0" 
                textColor="black" 
                borderColor="black" 
                className='inputText px-6 py-2' 
                type='text' 
                placeholder='Image URL' 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />

            <Button 
                bg="#c381b5" 
                textColor="#fefcd0" 
                shadow="#fefcd0" 
                className="w-60 px-6 py-2"  
                disabled={!wallet.publicKey || isLoading}
                onClick={createToken}
            >
                {isLoading ? "Creating Token..." : "Create Token"}
            </Button>

            {status && <p className="text-sm text-green-500">{status}</p>}

            <Popup
                isOpen={isPopupOpen}
                onClose={closePopup}
            >
                <div className="flex flex-col gap-4 p-4">
                    <h3 className="text-lg font-bold">Token Created Successfully!</h3>
                    <p>Token Details:</p>
                    <ul className="list-none">
                        <li><strong>Name:</strong> {name}</li>
                        <li><strong>Symbol:</strong> {symbol}</li>
                        <li><strong>Decimals:</strong> {decimals}</li>
                    </ul>
                    <p>Mint Address:</p>
                    <a 
                        href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 break-all"
                    >
                        {mintAddress}
                    </a>
                    <Button 
                        onClick={closePopup}
                        bg="#c381b5" 
                        textColor="#fefcd0" 
                        shadow="#fefcd0"
                    >
                        Close
                    </Button>
                </div>
            </Popup>
        </div>
    );
}
