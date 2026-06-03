# useZ — Private payments for your agents

Monorepo for the `use-zbase` React SDK and its demo web app.
Built on [zBase](https://zbase.app) · x402 · Privacy Pools · Groth16.

```
usez/
├── packages/
│   └── use-zbase/          ← npm package (the hook SDK)
│       └── src/
│           ├── types.ts
│           ├── client.ts
│           ├── context.tsx
│           ├── useZBasePayment.ts
│           └── useX402Payment.ts
└── apps/
    └── web/                ← Next.js 16 demo site
        └── src/
            ├── app/
            │   ├── layout.tsx
            │   └── page.tsx
            ├── components/
            │   ├── Ticker.tsx
            │   ├── Navbar.tsx
            │   ├── Hero.tsx
            │   ├── Features.tsx
            │   ├── CodeSection.tsx
            │   ├── PaymentDemo.tsx
            │   ├── DemoSection.tsx
            │   └── Footer.tsx
            ├── styles/
            │   └── globals.css
            └── proxy.ts    ← Next.js 16 (replaces middleware.ts)
```

## Getting started

```bash
# Install all dependencies
npm install

# Run the web app in dev mode
cd apps/web && npm run dev

# Build the SDK
cd packages/use-zbase && npm run build
```

## Stack

| Layer       | Tech |
|-------------|------|
| Framework   | Next.js 16 (Turbopack, App Router) |
| React       | 19.2 |
| Styling     | CSS Modules (no Tailwind) |
| Wallet      | wagmi v2 + viem |
| Monorepo    | npm workspaces + Turbo |
| Language    | TypeScript 5 |

## Key Next.js 16 features used

- **Turbopack** default bundler — no config needed
- **`proxy.ts`** instead of `middleware.ts`
- **`cacheComponents: true`** in `next.config.ts`
- **Async `params`** and `headers()` pattern
- **React Compiler** ready (disabled by default)

## Publishing the SDK

```bash
cd packages/use-zbase
npm run build
npm publish
```
