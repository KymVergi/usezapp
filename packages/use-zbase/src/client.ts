// ─────────────────────────────────────────────
//  use-zapp — API Client
// ─────────────────────────────────────────────

import type {
  ZappChain, ZappAsset, CommitmentHash,
  Nullifier, ZKProof, ZappTransaction,
} from "./types";

interface DepositResponse { depositTx: ZappTransaction; merkleIndex: number; }
interface ProveResponse   { proof: ZKProof; aspSignature: string; }
interface WithdrawResponse{ withdrawalTx: ZappTransaction; }

export class ZappClient {
  constructor(private apiUrl: string, private debug = false) {}

  private log(...a: unknown[]) { if (this.debug) console.log("[use-zapp]", ...a); }

  private async post<T>(path: string, body: unknown): Promise<T> {
    this.log(`POST ${path}`, body);
    const res = await fetch(`${this.apiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`zBase API ${res.status}: ${await res.text()}`);
    return res.json() as T;
  }

  buildDepositTx(p: { amount: string; asset: ZappAsset; chain: ZappChain; commitmentHash: CommitmentHash }) {
    return this.post<DepositResponse>("/v1/deposit/build", p);
  }

  generateProof(p: { commitmentHash: CommitmentHash; nullifier: Nullifier; merkleIndex: number; chain: ZappChain; aspUrl: string }) {
    return this.post<ProveResponse>("/v1/prove", p);
  }

  buildWithdrawalTx(p: { proof: ZKProof; nullifier: Nullifier; recipient: string; amount: string; asset: ZappAsset; chain: ZappChain; aspSignature: string }) {
    return this.post<WithdrawResponse>("/v1/withdraw/build", p);
  }
}

// ─── Crypto helpers ───────────────────────────────────────────────────────────

export async function deriveCommitment(nullifier: string, secret: string): Promise<CommitmentHash> {
  const data = new TextEncoder().encode(nullifier + secret);
  const buf  = await crypto.subtle.digest("SHA-256", data);
  const hex  = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return `0x${hex}` as CommitmentHash;
}

export function generateNullifier(): Nullifier {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")}` as Nullifier;
}

export function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}
