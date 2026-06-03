import styles from "./Hero.module.css";

const STEPS = [
  { n: "01", title: "Deposit",  desc: "USDC + commitment hash enter the Merkle tree alongside everyone else." },
  { n: "02", title: "Prove",    desc: "Groth16 proof of membership. ASP verifies the clean subset." },
  { n: "03", title: "Withdraw", desc: "Funds land at a fresh address. Zero on-chain link." },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          v0.1.0 — Base Live
        </div>

        <h1 className={styles.heading}>
          <span className={styles.line1}>Private payments</span>
          <br />
          <span className={styles.line2}>
            for your <em className={styles.em}>agents<span className={styles.cursor}>_</span></em>
          </span>
        </h1>

        <p className={styles.sub}>
          React hooks for zero-knowledge private payments via zBase.
          Deposit → prove → withdraw. No on-chain link between sender and receiver.
          ASP-compliant by construction.
        </p>

        <div className={styles.actions}>
          <code className={styles.installCmd}>npm install use-zapp</code>
          <a className={styles.docsLink} href="https://github.com" target="_blank" rel="noopener noreferrer">
            read the docs →
          </a>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.flowCard}>
          <p className={styles.flowLabel}>payment flow</p>

          {STEPS.map((s, i) => (
            <div key={s.n} style={{ animationDelay: `${0.35 + i * 0.12}s` }}>
              <div className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <div>
                  <p className={styles.stepTitle}>{s.title}</p>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
              {i < 2 && <div className={styles.divider} />}
            </div>
          ))}

          <div className={styles.tags}>
            {["Groth16", "ASP-compliant", "x402", "Base", "Solana"].map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
