"use client";
// ─────────────────────────────────────────────
//  use-zapp — Provider + Context
// ─────────────────────────────────────────────

import React, { createContext, useContext, useMemo } from "react";
import type { ZappConfig, ZappAsset, ZappChain } from "./types";
import { ZappClient } from "./client";

const DEFAULT_API_URL  = "https://api.zbase.app";
const DEFAULT_ASP_URL  = "https://asp.0xbow.io";
const DEFAULT_CHAIN: ZappChain = "base";
const DEFAULT_ASSET: ZappAsset = "USDC";

interface ZappContextValue {
  client: ZappClient;
  config: Required<ZappConfig>;
}

const ZappContext = createContext<ZappContextValue | null>(null);

export function ZappProvider({ config, children }: { config: ZappConfig; children: React.ReactNode }) {
  const full: Required<ZappConfig> = {
    apiUrl:       config.apiUrl       ?? DEFAULT_API_URL,
    defaultChain: config.defaultChain ?? DEFAULT_CHAIN,
    defaultAsset: config.defaultAsset ?? DEFAULT_ASSET,
    walletAdapter: config.walletAdapter,
    aspUrl:       config.aspUrl       ?? DEFAULT_ASP_URL,
    debug:        config.debug        ?? false,
  };

  const client = useMemo(() => new ZappClient(full.apiUrl, full.debug), [full.apiUrl, full.debug]);
  const value  = useMemo(() => ({ client, config: full }), [client, full]);

  return <ZappContext.Provider value={value}>{children}</ZappContext.Provider>;
}

export function useZappContext(): ZappContextValue {
  const ctx = useContext(ZappContext);
  if (!ctx) throw new Error("[use-zapp] Must be used inside <ZappProvider>.");
  return ctx;
}
