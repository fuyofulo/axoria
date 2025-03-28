"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button } from "pixel-retroui";
import { Input } from "pixel-retroui";

export function Airdrop() {
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

    // Use custom RPC URL
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );

    setIsAirdropping(true);
    setStatus("Requesting airdrop...");

    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        parsedAmount * LAMPORTS_PER_SOL
      );
      console.log("Airdrop signature:", signature);

      // Confirm transaction with retries
      let isConfirmed = false;
      for (let retries = 0; retries < 5; retries++) {
        const status = await connection.getSignatureStatus(signature, {
          searchTransactionHistory: true,
        });
        if (
          status &&
          status.value &&
          status.value.confirmationStatus === "confirmed"
        ) {
          isConfirmed = true;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
      }

      if (isConfirmed) {
        setStatus(`Airdropped ${parsedAmount} SOL successfully!`);
      } else {
        setStatus(
          "Airdrop confirmation timeout. Please check the transaction manually."
        );
      }
    } catch (error) {
      console.error("Airdrop failed:", error);

      // Use a concise error message
      const errorString = String(error);

      if (
        errorString.includes("429") ||
        errorString.includes("airdrop limit")
      ) {
        setStatus("Airdrop failed, visit faucet.solana.com");
      } else {
        setStatus("Airdrop failed. Please try again.");
      }
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-bold text-2xl">Airdrop some Solana</h1>
      <Input
        bg="#fefcd0"
        textColor="black"
        borderColor="black"
        className="inputText px-6 py-1"
        type="number"
        placeholder="Enter airdrop amount"
        value={amount}
        disabled={isAirdropping}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        bg="#c381b5"
        textColor="#fefcd0"
        shadow="#fefcd0"
        className="w-60 px-6 py-2"
        onClick={sendAirdropToUser}
        disabled={isAirdropping}
      >
        {isAirdropping ? "Airdropping..." : "Request Airdrop"}
      </Button>
      {status && (
        <p
          className={`text-sm ${
            status.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default Airdrop;
