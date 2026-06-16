import { TonClient } from "@ton/ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";

/**
 * Shared testnet TonClient built on TON Access (Orbs) — a free, decentralized,
 * unthrottled RPC. No API key needed. The endpoint is resolved once and cached.
 *
 * Orbs routes to a node per resolution; a node can occasionally return a
 * transient 5xx. `resetTonClient()` drops the cache so the next call re-resolves
 * to a (potentially different) node — use it to retry on failure.
 */
let cached: Promise<TonClient> | null = null;

export function getTonClient(): Promise<TonClient> {
  if (!cached) {
    cached = getHttpEndpoint({ network: "testnet" })
      .then((endpoint) => new TonClient({ endpoint }))
      .catch((e) => {
        cached = null; // don't cache a failed resolution
        throw e;
      });
  }
  return cached;
}

export function resetTonClient() {
  cached = null;
}

/** Runs `fn` with the shared client, retrying on transient node failures. */
export async function withTonClient<T>(fn: (client: TonClient) => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(await getTonClient());
    } catch (err) {
      lastErr = err;
      resetTonClient(); // re-resolve to a fresh node on the next attempt
      if (attempt < retries) await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr;
}
