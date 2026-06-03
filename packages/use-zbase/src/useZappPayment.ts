"use client";
// ─────────────────────────────────────────────
//  use-zapp — useZappPayment
// ─────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import type {
  ZappPaymentRequest, ZappPaymentResult,
  ZappPaymentStatus, ZKProof, CommitmentHash,
  Nullifier, UseZappPaymentReturn,
} from "./types";
import { deriveCommitment, generateNullifier, generateSecret } from "./client";
import { useZappContext } from "./context";

export function useZappPayment(): UseZappPaymentReturn {
  const { client, config } = useZappContext();

  const [status,         setStatus]         = useState<ZappPaymentStatus>("idle");
  const [error,          setError]          = useState<Error | null>(null);
  const [commitmentHash, setCommitmentHash] = useState<CommitmentHash | null>(null);
  const [proof,          setProof]          = useState<ZKProof | null>(null);
  const [result,         setResult]         = useState<ZappPaymentResult | null>(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus("idle"); setError(null);
    setCommitmentHash(null); setProof(null); setResult(null);
    setTimeout(() => { abortRef.current = false; }, 0);
  }, []);

  const pay = useCallback(async (req: ZappPaymentRequest): Promise<ZappPaymentResult | null> => {
    abortRef.current = false;
    const { walletAdapter, defaultChain, defaultAsset, aspUrl } = config;
    const chain = req.chain ?? defaultChain;
    const asset = defaultAsset;

    if (!walletAdapter.address) {
      const e = new Error("[use-zapp] Wallet not connected.");
      setError(e); setStatus("error"); return null;
    }

    try {
      // ── 1. DEPOSIT ────────────────────────────────────────────────────────
      setStatus("depositing"); setError(null);

      const nullifier  = generateNullifier() as Nullifier;
      const secret     = generateSecret();
      const commitment = await deriveCommitment(nullifier, secret);
      if (abortRef.current) return null;

      const { depositTx, merkleIndex } = await client.buildDepositTx({
        amount: req.amount, asset, chain, commitmentHash: commitment,
      });
      if (abortRef.current) return null;

      await walletAdapter.sendTransaction(depositTx);
      if (abortRef.current) return null;
      setCommitmentHash(commitment);

      // ── 2. PROVE ──────────────────────────────────────────────────────────
      setStatus("proving");

      const { proof: zkProof, aspSignature } = await client.generateProof({
        commitmentHash: commitment, nullifier, merkleIndex, chain, aspUrl,
      });
      if (abortRef.current) return null;
      setProof(zkProof);

      // ── 3. WITHDRAW ───────────────────────────────────────────────────────
      setStatus("withdrawing");

      const { withdrawalTx } = await client.buildWithdrawalTx({
        proof: zkProof, nullifier, recipient: req.recipient,
        amount: req.amount, asset, chain, aspSignature,
      });
      if (abortRef.current) return null;

      const withdrawalTxHash = await walletAdapter.sendTransaction(withdrawalTx);
      if (abortRef.current) return null;

      const paymentResult: ZappPaymentResult = {
        commitmentHash: commitment, nullifier, proof: zkProof,
        withdrawalTxHash, resolvedRecipient: req.recipient,
        chain, asset, amount: req.amount, completedAt: new Date(),
      };

      setResult(paymentResult);
      setStatus("complete");
      return paymentResult;

    } catch (err) {
      if (abortRef.current) return null;
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e); setStatus("error"); return null;
    }
  }, [client, config]);

  return {
    status,
    isLoading: ["depositing", "proving", "withdrawing"].includes(status),
    error, commitmentHash, proof, result, pay, reset,
  };
}
