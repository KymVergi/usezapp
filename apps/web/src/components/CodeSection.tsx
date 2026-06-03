import styles from "./CodeSection.module.css";

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className={styles.codeWrap}>
      <div className={styles.codeHeader}>
        <span className={styles.dot1} />
        <span className={styles.dot2} />
        <span className={styles.dot3} />
        <span className={styles.filename}>{filename}</span>
      </div>
      <pre className={styles.pre}><code>{code}</code></pre>
    </div>
  );
}

export function CodeSection() {
  return (
    <section className={styles.section} id="how-it-works">

      <div className={styles.row}>
        <div className={styles.prose}>
          <p className={styles.eyebrow}>002 · basic usage</p>
          <h2 className={styles.h2}>Two hooks.<br /><em className={styles.em}>That&apos;s it.</em></h2>
          <p className={styles.body}>
            Wrap your app in ZappProvider, connect your wallet adapter, call{" "}
            <code className={styles.inlineCode}>pay()</code>. ZK proof, Merkle
            tree insertion, and on-chain verification run under the hood.
          </p>
          <div className={styles.pills}>
            {["TypeScript", "React 18+", "Next.js 16", "wagmi v2"].map(p => (
              <span key={p} className={styles.pill}>{p}</span>
            ))}
          </div>
        </div>
        <CodeBlock filename="PayButton.tsx" code={`import { useZappPayment } from "use-zapp"

export function PayButton() {
  const {
    pay, status, isLoading, result
  } = useZappPayment()

  const handlePay = async () => {
    await pay({
      amount:    "10.00",      // USDC
      recipient: "0xFresh…",  // fresh addr
      chain:     "base",
    })
  }

  return (
    <button onClick={handlePay} disabled={isLoading}>
      {isLoading ? status : "Pay 10 USDC"}
    </button>
  )
}`} />
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.prose}>
          <p className={styles.eyebrow}>003 · x402 endpoints</p>
          <h2 className={styles.h2}>Pay APIs<br /><em className={styles.em}>privately.</em></h2>
          <p className={styles.body}>
            <code className={styles.inlineCode}>fetchWithPayment()</code> wraps
            fetch. On HTTP 402, pays via zBase and retries. The provider never
            learns which wallet paid.
          </p>
          <div className={styles.pills}>
            {["x402 protocol", "X-Payment-Proof", "auto-retry", "zero identity"].map(p => (
              <span key={p} className={styles.pill}>{p}</span>
            ))}
          </div>
        </div>
        <CodeBlock filename="AgentFetcher.tsx" code={`import { useX402Payment } from "use-zapp"

export function AgentFetcher() {
  const { fetchWithPayment, isPaying }
    = useX402Payment()

  const fetchData = async () => {
    // 402 → auto-pay → retry
    const res = await fetchWithPayment(
      "https://api.example.com/premium"
    )
    const data = await res.json()
    console.log(data)
  }

  return (
    <button onClick={fetchData}>
      {isPaying ? "paying…" : "fetch data"}
    </button>
  )
}`} />
      </div>

      <div className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.prose}>
          <p className={styles.eyebrow}>004 · setup</p>
          <h2 className={styles.h2}>One provider.<br /><em className={styles.em}>Any chain.</em></h2>
          <p className={styles.body}>
            Implement <code className={styles.inlineCode}>ZappWalletAdapter</code>{" "}
            for wagmi, viem, or a custom Solana adapter. Everything else stays the same.
          </p>
          <div className={styles.pills}>
            {["wagmi v2", "viem", "Solana web3.js", "custom"].map(p => (
              <span key={p} className={styles.pill}>{p}</span>
            ))}
          </div>
        </div>
        <CodeBlock filename="layout.tsx" code={`import { ZappProvider } from "use-zapp"
import { myWalletAdapter } from "@/lib/wallet"

export default function Layout({ children }) {
  return (
    <ZappProvider
      config={{
        walletAdapter: myWalletAdapter,
        defaultChain: "base",
        debug: true,
      }}
    >
      {children}
    </ZappProvider>
  )
}`} />
      </div>

    </section>
  );
}
