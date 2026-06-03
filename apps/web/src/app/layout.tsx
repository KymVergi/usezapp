import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "zApp · Private payments hooks",
  description: "React hooks for zero-knowledge private payments. Deposit → prove → withdraw. No on-chain link.",
  keywords: ["zbase", "x402", "zero-knowledge", "privacy", "react", "hooks"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
