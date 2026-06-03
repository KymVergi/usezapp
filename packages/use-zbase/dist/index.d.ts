import React from 'react';

type ZappChain = "base" | "base-sepolia" | "solana" | "solana-devnet";
type ZappAsset = "USDC";
type ZappPaymentStatus = "idle" | "depositing" | "proving" | "withdrawing" | "complete" | "error";
interface ZappPaymentRequest {
    amount: string;
    recipient: string;
    chain: ZappChain;
    memo?: string;
    x402PaymentPointer?: string;
}
type CommitmentHash = `0x${string}`;
type Nullifier = `0x${string}`;
interface ZKProof {
    pi_a: [string, string];
    pi_b: [[string, string], [string, string]];
    pi_c: [string, string];
    publicInputs: string[];
}
interface ZappPaymentResult {
    commitmentHash: CommitmentHash;
    nullifier: Nullifier;
    proof: ZKProof;
    withdrawalTxHash: string;
    resolvedRecipient: string;
    chain: ZappChain;
    asset: ZappAsset;
    amount: string;
    completedAt: Date;
}
interface UseZappPaymentReturn {
    status: ZappPaymentStatus;
    isLoading: boolean;
    error: Error | null;
    commitmentHash: CommitmentHash | null;
    proof: ZKProof | null;
    result: ZappPaymentResult | null;
    pay: (request: ZappPaymentRequest) => Promise<ZappPaymentResult | null>;
    reset: () => void;
}
interface ZappConfig {
    apiUrl?: string;
    defaultChain?: ZappChain;
    defaultAsset?: ZappAsset;
    walletAdapter: ZappWalletAdapter;
    aspUrl?: string;
    debug?: boolean;
}
interface ZappWalletAdapter {
    address: string | null;
    sendTransaction: (tx: ZappTransaction) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
    chain: ZappChain | null;
}
interface ZappTransaction {
    to: string;
    data: string;
    value?: bigint;
    chain: ZappChain;
}

declare function useZappPayment(): UseZappPaymentReturn;

interface UseX402PaymentReturn {
    fetchWithPayment: (url: string, init?: RequestInit) => Promise<Response>;
    isPaying: boolean;
    error: Error | null;
}
/**
 * useX402Payment — transparent x402 payment handler.
 * On 402: parse header → pay via zBase → retry with X-Payment-Proof.
 */
declare function useX402Payment(): UseX402PaymentReturn;

declare function deriveCommitment(nullifier: string, secret: string): Promise<CommitmentHash>;
declare function generateNullifier(): Nullifier;
declare function generateSecret(): string;

declare function ZappProvider({ config, children }: {
    config: ZappConfig;
    children: React.ReactNode;
}): React.JSX.Element;

export { type CommitmentHash, type Nullifier, type UseX402PaymentReturn, type UseZappPaymentReturn, type ZKProof, type ZappAsset, type ZappChain, type ZappConfig, type ZappPaymentRequest, type ZappPaymentResult, type ZappPaymentStatus, ZappProvider, type ZappTransaction, type ZappWalletAdapter, deriveCommitment, generateNullifier, generateSecret, useX402Payment, useZappPayment };
