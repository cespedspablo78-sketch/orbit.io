"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

/** TON Connect provider scoped to /token routes (buy/sell need the wallet). */
const MANIFEST_URL = "https://orbit-io-amber.vercel.app/tonconnect-manifest.json";

export default function TokenLayout({ children }: { children: React.ReactNode }) {
  return <TonConnectUIProvider manifestUrl={MANIFEST_URL}>{children}</TonConnectUIProvider>;
}
