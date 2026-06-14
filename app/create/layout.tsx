"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";

/**
 * TON Connect provider scoped to the /create route only — keeps the wallet
 * SDK out of the marketing landing bundle. The manifest is served from the
 * production domain so it resolves the same in local dev and on Vercel.
 */
const MANIFEST_URL = "https://orbit-io-amber.vercel.app/tonconnect-manifest.json";

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <TonConnectUIProvider manifestUrl={MANIFEST_URL}>{children}</TonConnectUIProvider>;
}
