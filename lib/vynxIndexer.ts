import { Address } from "@ton/core";
import {
  VYNX_ADDRESSES,
  VynxFactory,
  VynxBondingCurve,
  getState,
} from "@/lib/vynx-sdk";
import { loadCreateCoin } from "@/lib/vynx-sdk/generated/factory";
import { withTonClient } from "@/lib/tonClient";

/**
 * Client-side indexer for VYNX launches — 100% real on-chain data.
 *
 * The factory keeps only a counter (getTotalCoins), not a list of coins. We
 * discover launches by scanning the factory's transactions for incoming
 * `CreateCoin` messages (op 2494094088). That message carries the token's
 * name/ticker/description/image, and its internal sender is the creator. From
 * those params we recompute the jetton + curve addresses with the factory's
 * get-methods (same as predictCoinAddresses), then read the live curve state.
 *
 * No mock data: if nothing is found, callers show an empty state.
 */

const FRIENDLY = { testOnly: true, bounceable: true } as const;

export interface Launch {
  jetton: string;
  curve: string;
  creator: string | null;
  at: number; // unix seconds
  name: string;
  ticker: string;
  description: string;
  imageUrl: string;
}

export interface TokenInfo extends Launch {
  priceNano: bigint;
  mcNano: bigint;
  reserveNano: bigint;
  progress: number;
  graduated: boolean;
}

/** Total coins created (real counter on the factory). */
export function getTotalCoins(): Promise<number> {
  return withTonClient(async (client) => {
    const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));
    return Number(await factory.getTotalCoins());
  });
}

/**
 * Scan factory transactions (newest first, paginated) for CreateCoin messages
 * and recompute each token's addresses. Returns recent launches, newest first.
 */
export function listRecentLaunches(limit = 12): Promise<Launch[]> {
  return withTonClient(async (client) => {
    const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));
    const launches: Launch[] = [];
    const seen = new Set<string>();

    let lt: string | undefined;
    let hash: string | undefined;

    for (let page = 0; page < 6 && launches.length < limit; page++) {
      const opts: Parameters<typeof client.getTransactions>[1] = { limit: 30, archival: true };
      if (lt && hash) {
        opts.lt = lt;
        opts.hash = hash;
      }
      const txs = await client.getTransactions(VYNX_ADDRESSES.factory, opts);
      if (txs.length === 0) break;

      for (const tx of txs) {
        const inMsg = tx.inMessage;
        if (!inMsg || inMsg.info.type !== "internal") continue;
        let cc;
        try {
          cc = loadCreateCoin(inMsg.body.beginParse());
        } catch {
          continue; // not a CreateCoin message
        }
        const creator = inMsg.info.src;
        try {
          const jetton = await factory.getJettonAddress(creator, cc.name, cc.ticker, cc.description, cc.imageUrl);
          const key = jetton.toString();
          if (seen.has(key)) continue;
          seen.add(key);
          const curve = await factory.getCurveAddress(jetton);
          launches.push({
            jetton: jetton.toString(FRIENDLY),
            curve: curve.toString(FRIENDLY),
            creator: creator.toString(FRIENDLY),
            at: tx.now,
            name: cc.name,
            ticker: cc.ticker,
            description: cc.description,
            imageUrl: cc.imageUrl,
          });
          if (launches.length >= limit) break;
        } catch {
          /* transient RPC error for this token — skip, next refetch picks it up */
        }
      }

      const last = txs[txs.length - 1];
      lt = last.lt.toString();
      hash = last.hash().toString("base64");
    }

    return launches.slice(0, limit);
  });
}

/** Read live curve state for one launch and merge into a TokenInfo. */
export function loadToken(l: Launch): Promise<TokenInfo> {
  return withTonClient(async (client) => {
    const curve = client.open(VynxBondingCurve.fromAddress(Address.parse(l.curve)));
    const st = await getState(curve);
    return {
      ...l,
      priceNano: st.price,
      mcNano: st.price * st.soldTokens,
      reserveNano: st.reserve,
      progress: Math.min(100, st.progress),
      graduated: st.graduated,
    };
  });
}

/** List recent launches and load each token's live state (parallel, fault-tolerant). */
export async function getLaunches(limit = 12): Promise<TokenInfo[]> {
  const launches = await listRecentLaunches(limit);
  const infos = await Promise.allSettled(launches.map(loadToken));
  return infos
    .filter((r): r is PromiseFulfilledResult<TokenInfo> => r.status === "fulfilled")
    .map((r) => r.value);
}
