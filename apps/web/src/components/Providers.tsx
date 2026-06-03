"use client";

import { ReactNode, useMemo } from "react";
import { WagmiProvider, createConfig, http, useAccount, useSignMessage, useSendTransaction } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet } from "@wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ZappProvider } from "use-zapp";
import type { ZappWalletAdapter, ZappTransaction } from "use-zapp";

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "useZapp" }),
  ],
  transports: {
    [base.id]:        http(),
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

function ZappWrapper({ children }: { children: ReactNode }) {
  const { address, chain } = useAccount();
  const { signMessageAsync }    = useSignMessage();
  const { sendTransactionAsync } = useSendTransaction();

  const walletAdapter: ZappWalletAdapter = useMemo(() => ({
    address: address ?? null,
    chain: (() => {
      if (!chain) return null;
      if (chain.id === 8453)  return "base";
      if (chain.id === 84532) return "base-sepolia";
      return null;
    })(),
    signMessage: (msg: string) => signMessageAsync({ message: msg }),
    sendTransaction: async (tx: ZappTransaction) => {
      return sendTransactionAsync({
        to:    tx.to    as `0x${string}`,
        data:  tx.data  as `0x${string}`,
        value: tx.value,
      });
    },
  }), [address, chain, signMessageAsync, sendTransactionAsync]);

  return (
    <ZappProvider config={{ walletAdapter, defaultChain: "base-sepolia", debug: true }}>
      {children}
    </ZappProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ZappWrapper>{children}</ZappWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
