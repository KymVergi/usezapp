import styles from "./Features.module.css";

const FEATURES = [
  {
    num: "01",
    title: "useZappPayment()",
    body: "Full deposit → prove → withdraw flow in one hook. Status, errors, and ZK proof — all typed and reactive. Abort on unmount included.",
  },
  {
    num: "02",
    title: "useX402Payment()",
    body: "Drop-in fetch wrapper. Detects 402 responses, pays via zBase privately, and retries with X-Payment-Proof. Agents pay APIs without revealing identity.",
  },
  {
    num: "03",
    title: "ZappProvider",
    body: "Context-based config. Pass your wallet adapter once, use hooks anywhere in the tree. Supports wagmi, viem, and custom adapters.",
  },
  {
    num: "04",
    title: "Chain-agnostic",
    body: "Base, Base Sepolia, Solana, Solana Devnet. Same hooks, same API. Switch chains by changing one config option.",
  },
  {
    num: "05",
    title: "ASP-compliant",
    body: "Association Set Provider integration baked in. Every withdrawal is gated through the clean subset — regulatory compliance by construction.",
  },
  {
    num: "06",
    title: "Fully typed",
    body: "End-to-end TypeScript. ZKProof, CommitmentHash, Nullifier, and all request/result types exported. Your IDE knows everything.",
  },
];

export function Features() {
  return (
    <section className={styles.section} id="hooks">
      <div className={styles.header}>
        <span className={styles.num}>001</span>
        <span className={styles.title}>What you get</span>
      </div>
      <div className={styles.grid}>
        {FEATURES.map(f => (
          <div key={f.num} className={styles.card}>
            <span className={styles.cardNum}>{f.num}</span>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardBody}>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
