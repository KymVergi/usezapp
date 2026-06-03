"use client";
// ─────────────────────────────────────────────
//  use-zapp — useX402Payment
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { useZappPayment } from "./useZappPayment";
import { useZappContext } from "./context";
import type { ZappChain } from "./types";

export interface UseX402PaymentReturn {
  fetchWithPayment: (url: string, init?: RequestInit) => Promise<Response>;
  isPaying: boolean;
  error: Error | null;
}

/**
 * useX402Payment — transparent x402 payment handler.
 * On 402: parse header → pay via zBase → retry with X-Payment-Proof.
 */
export function useX402Payment(): UseX402PaymentReturn {
  const { config } = useZappContext();
  const { pay }    = useZappPayment();
  const [isPaying, setIsPaying] = useState(false);
  const [error,    setError]    = useState<Error | null>(null);

  const fetchWithPayment = useCallback(async (url: string, init?: RequestInit): Promise<Response> => {
    setError(null);
    const first = await fetch(url, init);
    if (first.status !== 402) return first;

    const header = first.headers.get("X-Payment-Required");
    if (!header) {
      const e = new Error("[use-zapp] 402 missing X-Payment-Required header");
      setError(e); throw e;
    }

    let info: { recipient: string; amount: string; chain?: ZappChain };
    try { info = JSON.parse(header); }
    catch {
      const e = new Error("[use-zapp] Could not parse X-Payment-Required");
      setError(e); throw e;
    }

    setIsPaying(true);
    try {
      const result = await pay({
        amount: info.amount, recipient: info.recipient,
        chain: info.chain ?? config.defaultChain,
        x402PaymentPointer: url,
      });

      if (!result) {
        const e = new Error("[use-zapp] Payment failed or was cancelled");
        setError(e); throw e;
      }

      return fetch(url, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          "X-Payment-Proof": JSON.stringify({
            withdrawalTxHash: result.withdrawalTxHash,
            nullifier:        result.nullifier,
            chain:            result.chain,
          }),
        },
      });
    } finally {
      setIsPaying(false);
    }
  }, [pay, config]);

  return { fetchWithPayment, isPaying, error };
}
