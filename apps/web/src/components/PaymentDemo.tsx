"use client";

import { useState } from "react";
import { useZappPayment } from "use-zapp";
import type { ZappChain } from "use-zapp";
import styles from "./PaymentDemo.module.css";

const PHASE_LABELS: Record<string, string> = {
  depositing: "① Depositing into pool…",
  proving:    "② Generating ZK proof…",
  withdrawing:"③ Withdrawing to recipient…",
  complete:   "✓ Payment complete",
  error:      "Payment failed",
};

export function PaymentDemo() {
  const { pay, status, isLoading, result, error, reset } = useZappPayment();
  const [amount,    setAmount]    = useState("10.00");
  const [recipient, setRecipient] = useState("");
  const [chain,     setChain]     = useState<ZappChain>("base-sepolia");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await pay({ amount, recipient, chain });
  };

  if (status === "complete" && result) {
    return (
      <div className={styles.success}>
        <p className={styles.successLabel}>✓ Payment complete</p>
        <div className={styles.resultGrid}>
          <span className={styles.key}>amount</span>
          <span className={styles.val}>{result.amount} USDC</span>
          <span className={styles.key}>chain</span>
          <span className={styles.val}>{result.chain}</span>
          <span className={styles.key}>tx</span>
          <a
            className={styles.txLink}
            href={`https://basescan.org/tx/${result.withdrawalTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.withdrawalTxHash.slice(0, 18)}…
          </a>
          <span className={styles.key}>on-chain link?</span>
          <span className={styles.none}>none — ZK verified</span>
        </div>
        <button className={styles.reset} onClick={reset}>← new payment</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Amount (USDC)</label>
        <input
          className={styles.input}
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          disabled={isLoading}
          placeholder="10.00"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Recipient address</label>
        <input
          className={styles.input}
          type="text"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
          disabled={isLoading}
          placeholder="0x…"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Chain</label>
        <select
          className={styles.select}
          value={chain}
          onChange={e => setChain(e.target.value as ZappChain)}
          disabled={isLoading}
        >
          <option value="base-sepolia">Base Sepolia (testnet)</option>
          <option value="base">Base (mainnet)</option>
          <option value="solana-devnet">Solana Devnet</option>
          <option value="solana">Solana (mainnet)</option>
        </select>
      </div>

      {isLoading && (
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{PHASE_LABELS[status]}</span>
        </div>
      )}

      {error && (
        <div className={styles.errorBar}>
          {error.message}
        </div>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={isLoading || !recipient || !amount}
      >
        {isLoading ? PHASE_LABELS[status] : "Send privately via zBase →"}
      </button>
    </form>
  );
}
