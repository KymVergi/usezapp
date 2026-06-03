import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.logo}>
           <div className={styles.logo}>
        <img
        src="/pfp_zapp.png"
        alt="useZapp"
        className={styles.logoMark}
        width={28}
        height={28}
      />
        <span>zApp</span>
      </div>
        </div>
        <p className={styles.tagline}>
          Privacy is for all, including your agents.
        </p>
      </div>

      <div className={styles.links}>
        <div className={styles.col}>
          <p className={styles.colTitle}>Package</p>
          <a href="https://npmjs.com" target="_blank" rel="noopener noreferrer">npm</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">github</a>
          <a href="/docs">docs</a>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Protocol</p>
          <a href="https://zbase.app" target="_blank" rel="noopener noreferrer">zBase</a>
          <a href="https://x402.org" target="_blank" rel="noopener noreferrer">x402</a>
          <a href="https://0xbow.io" target="_blank" rel="noopener noreferrer">0xbow (ASP)</a>
        </div>
        <div className={styles.col}>
          <p className={styles.colTitle}>Lineage</p>
          <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4563364" target="_blank" rel="noopener noreferrer">Privacy Pools paper</a>
          <a href="https://base.org" target="_blank" rel="noopener noreferrer">Base</a>
          <a href="https://solana.com" target="_blank" rel="noopener noreferrer">Solana</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 useZ · MIT License · Built on Privacy Pools · Groth16 · x402</p>
      </div>
    </footer>
  );
}
