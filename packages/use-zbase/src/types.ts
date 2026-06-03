// ─────────────────────────────────────────────
//  use-zapp — Types
// ─────────────────────────────────────────────

export type ZappChain = "base" | "base-sepolia" | "solana" | "solana-devnet";
export type ZappAsset = "USDC";

export type ZappPaymentStatus =
  | "idle"
  | "depositing"
  | "proving"
  | "withdrawing"
  | "complete"
  | "error";

export interface ZappPaymentRequest {
  amount: string;
  recipient: string;
  chain: ZappChain;
  memo?: string;
  x402PaymentPointer?: string;
}

export type CommitmentHash = `0x${string}`;
export type Nullifier = `0x${string}`;

export interface ZKProof {
  pi_a: [string, string];
  pi_b: [[string, string], [string, string]];
  pi_c: [string, string];
  publicInputs: string[];
}

export interface ZappPaymentResult {
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

export interface UseZappPaymentReturn {
  status: ZappPaymentStatus;
  isLoading: boolean;
  error: Error | null;
  commitmentHash: CommitmentHash | null;
  proof: ZKProof | null;
  result: ZappPaymentResult | null;
  pay: (request: ZappPaymentRequest) => Promise<ZappPaymentResult | null>;
  reset: () => void;
}

export interface ZappConfig {
  apiUrl?: string;
  defaultChain?: ZappChain;
  defaultAsset?: ZappAsset;
  walletAdapter: ZappWalletAdapter;
  aspUrl?: string;
  debug?: boolean;
}

export interface ZappWalletAdapter {
  address: string | null;
  sendTransaction: (tx: ZappTransaction) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  chain: ZappChain | null;
}

export interface ZappTransaction {
  to: string;
  data: string;
  value?: bigint;
  chain: ZappChain;
}
