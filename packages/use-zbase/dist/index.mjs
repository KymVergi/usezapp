// src/useZappPayment.ts
import { useState, useCallback, useRef } from "react";

// src/client.ts
var ZappClient = class {
  constructor(apiUrl, debug = false) {
    this.apiUrl = apiUrl;
    this.debug = debug;
  }
  log(...a) {
    if (this.debug) console.log("[use-zapp]", ...a);
  }
  async post(path, body) {
    this.log(`POST ${path}`, body);
    const res = await fetch(`${this.apiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`zBase API ${res.status}: ${await res.text()}`);
    return res.json();
  }
  buildDepositTx(p) {
    return this.post("/v1/deposit/build", p);
  }
  generateProof(p) {
    return this.post("/v1/prove", p);
  }
  buildWithdrawalTx(p) {
    return this.post("/v1/withdraw/build", p);
  }
};
async function deriveCommitment(nullifier, secret) {
  const data = new TextEncoder().encode(nullifier + secret);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${hex}`;
}
function generateNullifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `0x${Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}
function generateSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// src/context.tsx
import { createContext, useContext, useMemo } from "react";
import { jsx } from "react/jsx-runtime";
var DEFAULT_API_URL = "https://api.zbase.app";
var DEFAULT_ASP_URL = "https://asp.0xbow.io";
var DEFAULT_CHAIN = "base";
var DEFAULT_ASSET = "USDC";
var ZappContext = createContext(null);
function ZappProvider({ config, children }) {
  const full = {
    apiUrl: config.apiUrl ?? DEFAULT_API_URL,
    defaultChain: config.defaultChain ?? DEFAULT_CHAIN,
    defaultAsset: config.defaultAsset ?? DEFAULT_ASSET,
    walletAdapter: config.walletAdapter,
    aspUrl: config.aspUrl ?? DEFAULT_ASP_URL,
    debug: config.debug ?? false
  };
  const client = useMemo(() => new ZappClient(full.apiUrl, full.debug), [full.apiUrl, full.debug]);
  const value = useMemo(() => ({ client, config: full }), [client, full]);
  return /* @__PURE__ */ jsx(ZappContext.Provider, { value, children });
}
function useZappContext() {
  const ctx = useContext(ZappContext);
  if (!ctx) throw new Error("[use-zapp] Must be used inside <ZappProvider>.");
  return ctx;
}

// src/useZappPayment.ts
function useZappPayment() {
  const { client, config } = useZappContext();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [commitmentHash, setCommitmentHash] = useState(null);
  const [proof, setProof] = useState(null);
  const [result, setResult] = useState(null);
  const abortRef = useRef(false);
  const reset = useCallback(() => {
    abortRef.current = true;
    setStatus("idle");
    setError(null);
    setCommitmentHash(null);
    setProof(null);
    setResult(null);
    setTimeout(() => {
      abortRef.current = false;
    }, 0);
  }, []);
  const pay = useCallback(async (req) => {
    abortRef.current = false;
    const { walletAdapter, defaultChain, defaultAsset, aspUrl } = config;
    const chain = req.chain ?? defaultChain;
    const asset = defaultAsset;
    if (!walletAdapter.address) {
      const e = new Error("[use-zapp] Wallet not connected.");
      setError(e);
      setStatus("error");
      return null;
    }
    try {
      setStatus("depositing");
      setError(null);
      const nullifier = generateNullifier();
      const secret = generateSecret();
      const commitment = await deriveCommitment(nullifier, secret);
      if (abortRef.current) return null;
      const { depositTx, merkleIndex } = await client.buildDepositTx({
        amount: req.amount,
        asset,
        chain,
        commitmentHash: commitment
      });
      if (abortRef.current) return null;
      await walletAdapter.sendTransaction(depositTx);
      if (abortRef.current) return null;
      setCommitmentHash(commitment);
      setStatus("proving");
      const { proof: zkProof, aspSignature } = await client.generateProof({
        commitmentHash: commitment,
        nullifier,
        merkleIndex,
        chain,
        aspUrl
      });
      if (abortRef.current) return null;
      setProof(zkProof);
      setStatus("withdrawing");
      const { withdrawalTx } = await client.buildWithdrawalTx({
        proof: zkProof,
        nullifier,
        recipient: req.recipient,
        amount: req.amount,
        asset,
        chain,
        aspSignature
      });
      if (abortRef.current) return null;
      const withdrawalTxHash = await walletAdapter.sendTransaction(withdrawalTx);
      if (abortRef.current) return null;
      const paymentResult = {
        commitmentHash: commitment,
        nullifier,
        proof: zkProof,
        withdrawalTxHash,
        resolvedRecipient: req.recipient,
        chain,
        asset,
        amount: req.amount,
        completedAt: /* @__PURE__ */ new Date()
      };
      setResult(paymentResult);
      setStatus("complete");
      return paymentResult;
    } catch (err) {
      if (abortRef.current) return null;
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
      setStatus("error");
      return null;
    }
  }, [client, config]);
  return {
    status,
    isLoading: ["depositing", "proving", "withdrawing"].includes(status),
    error,
    commitmentHash,
    proof,
    result,
    pay,
    reset
  };
}

// src/useX402Payment.ts
import { useState as useState2, useCallback as useCallback2 } from "react";
function useX402Payment() {
  const { config } = useZappContext();
  const { pay } = useZappPayment();
  const [isPaying, setIsPaying] = useState2(false);
  const [error, setError] = useState2(null);
  const fetchWithPayment = useCallback2(async (url, init) => {
    setError(null);
    const first = await fetch(url, init);
    if (first.status !== 402) return first;
    const header = first.headers.get("X-Payment-Required");
    if (!header) {
      const e = new Error("[use-zapp] 402 missing X-Payment-Required header");
      setError(e);
      throw e;
    }
    let info;
    try {
      info = JSON.parse(header);
    } catch {
      const e = new Error("[use-zapp] Could not parse X-Payment-Required");
      setError(e);
      throw e;
    }
    setIsPaying(true);
    try {
      const result = await pay({
        amount: info.amount,
        recipient: info.recipient,
        chain: info.chain ?? config.defaultChain,
        x402PaymentPointer: url
      });
      if (!result) {
        const e = new Error("[use-zapp] Payment failed or was cancelled");
        setError(e);
        throw e;
      }
      return fetch(url, {
        ...init,
        headers: {
          ...init?.headers ?? {},
          "X-Payment-Proof": JSON.stringify({
            withdrawalTxHash: result.withdrawalTxHash,
            nullifier: result.nullifier,
            chain: result.chain
          })
        }
      });
    } finally {
      setIsPaying(false);
    }
  }, [pay, config]);
  return { fetchWithPayment, isPaying, error };
}
export {
  ZappProvider,
  deriveCommitment,
  generateNullifier,
  generateSecret,
  useX402Payment,
  useZappPayment
};
