"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HOLDERS,
  TRADES,
  WALLETS,
  fmtAgeSec,
  fmtPrice,
  fmtUsd,
  genCandles,
  getToken,
} from "@/lib/terminalMock";
import { Change, CoinAvatar, DOWN, ICONS, TIcon, UP } from "@/components/terminal/ui";

const Chart = dynamic(() => import("@/components/terminal/Chart"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-lg bg-white/[0.02]" />,
});

const TIMEFRAMES = ["1m", "5m", "15m", "1h", "4h", "1d"] as const;
const QUICK = ["0.1", "0.5", "1", "5"] as const;
const BOTTOM_TABS = ["Trades", "Holders", "Top Traders", "Info"] as const;

export default function TokenDetail({ params }: { params: { address: string } }) {
  const token = getToken(params.address);
  const [tf, setTf] = useState<(typeof TIMEFRAMES)[number]>("5m");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [showSlippage, setShowSlippage] = useState(false);
  const [bottomTab, setBottomTab] = useState<(typeof BOTTOM_TABS)[number]>("Trades");

  const candles = useMemo(() => (token ? genCandles(token.address + tf, 160, token.price) : []), [token, tf]);

  if (!token) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-xl font-bold">Token not found</h1>
        <Link href="/terminal" className="mt-5 rounded-lg bg-ton px-5 py-2.5 text-sm font-bold transition hover:bg-ton-bright">
          Back to terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6">
      {/* header */}
      <div className="flex flex-wrap items-center gap-4 border-b border-white/[0.06] pb-4">
        <Link href="/terminal" className="text-white/40 transition hover:text-white">
          <TIcon d={ICONS.back} className="h-5 w-5" />
        </Link>
        <CoinAvatar token={token} className="h-10 w-10 text-lg" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-lg font-bold">{token.name}</h1>
            <span className="text-sm text-white/35">${token.ticker}</span>
          </div>
          <div className="font-mono text-xs text-white/30">{token.address}</div>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div>
            <div className="font-display text-xl font-bold tabular-nums">{fmtPrice(token.price)}</div>
            <div className="text-right text-xs">
              <Change value={token.change24h} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr,340px]">
        {/* ===== left: chart + bottom tabs ===== */}
        <div className="min-w-0">
          <div className="rounded-xl border border-white/[0.06] bg-[#0E0E10] p-3">
            <div className="flex items-center gap-1">
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold tabular-nums transition ${
                    tf === t ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-2 h-[340px] sm:h-[420px]">
              <Chart candles={candles} />
            </div>
          </div>

          {/* stats strip */}
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
            {[
              ["Market Cap", fmtUsd(token.mc)],
              ["Volume 24h", fmtUsd(token.volume24h)],
              ["Holders", token.holders.toLocaleString("en-US")],
              [token.graduated ? "Liquidity" : "Bonding", token.graduated ? fmtUsd(token.liquidity) : `${token.progress}%`],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#0E0E10] px-4 py-3">
                <div className="text-[11px] text-white/35">{label}</div>
                <div className="mt-0.5 font-display font-bold tabular-nums">{value}</div>
              </div>
            ))}
          </div>

          {/* bottom tabs */}
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#0E0E10]">
            <div className="flex items-center gap-1 border-b border-white/[0.06] px-3">
              {BOTTOM_TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setBottomTab(t)}
                  className={`relative px-3 py-3 text-sm font-medium transition ${
                    bottomTab === t ? "text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {t}
                  {bottomTab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ton" />}
                </button>
              ))}
            </div>
            <div className="p-3">
              {bottomTab === "Trades" && <TradesTab />}
              {bottomTab === "Holders" && <HoldersTab />}
              {bottomTab === "Top Traders" && <TopTradersTab />}
              {bottomTab === "Info" && <InfoTab token={token} />}
            </div>
          </div>
        </div>

        {/* ===== right: trade panel ===== */}
        <div className="lg:sticky lg:top-[72px] lg:self-start">
          <div className="rounded-xl border border-white/[0.06] bg-[#0E0E10] p-4">
            {/* buy/sell tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#0A0A0B] p-1">
              {(["buy", "sell"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className="rounded-md py-2 text-sm font-bold capitalize transition"
                  style={
                    side === s
                      ? { background: `${s === "buy" ? UP : DOWN}26`, color: s === "buy" ? UP : DOWN }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            {/* amount */}
            <div className="relative mt-4">
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full rounded-lg border border-white/[0.06] bg-[#0A0A0B] px-3 py-3 pr-14 font-display text-lg font-bold tabular-nums outline-none transition placeholder:text-white/25 focus:border-ton/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">TON</span>
            </div>

            {/* quick amounts */}
            <div className="mt-2 grid grid-cols-4 gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q)}
                  className="rounded-md border border-white/[0.06] bg-[#0A0A0B] py-1.5 text-xs font-bold tabular-nums text-white/45 transition hover:border-ton/30 hover:text-white/80"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* slippage (collapsed) */}
            <button
              onClick={() => setShowSlippage((v) => !v)}
              className="mt-4 flex w-full items-center justify-between text-xs text-white/40 transition hover:text-white/70"
            >
              <span>Slippage · 2%</span>
              <TIcon d={ICONS.chevron} className={`h-4 w-4 transition ${showSlippage ? "rotate-90" : ""}`} />
            </button>
            {showSlippage && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {["1%", "2%", "5%", "10%"].map((s) => (
                  <button key={s} className="rounded-md border border-white/[0.06] bg-[#0A0A0B] py-1.5 text-xs font-bold text-white/45 transition hover:border-ton/30 hover:text-white/80">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* action */}
            <button
              className="mt-4 w-full rounded-lg py-3 font-display font-bold text-white transition active:scale-[0.99]"
              style={{ background: side === "buy" ? UP : DOWN }}
            >
              {side === "buy" ? "Buy" : "Sell"} {token.ticker}
            </button>

            {/* holdings / pnl */}
            <div className="mt-5 space-y-2.5 border-t border-white/[0.06] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-white/40">Your holdings</span>
                <span className="tabular-nums text-white/70">0 {token.ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Value</span>
                <span className="tabular-nums text-white/70">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">P&amp;L</span>
                <span className="tabular-nums text-white/40">—</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/25">Preview · trading not live yet</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- bottom tab contents ---------- */
function TradesTab() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-[11px] uppercase tracking-wider text-white/30">
          <th className="pb-2 font-medium">Side</th>
          <th className="pb-2 font-medium">Price</th>
          <th className="pb-2 font-medium">Amount</th>
          <th className="pb-2 font-medium">Wallet</th>
          <th className="pb-2 text-right font-medium">Age</th>
        </tr>
      </thead>
      <tbody>
        {TRADES.map((t, i) => (
          <tr key={i} className="border-t border-white/[0.04]">
            <td className="py-2 font-semibold capitalize" style={{ color: t.side === "buy" ? UP : DOWN }}>{t.side}</td>
            <td className="py-2 tabular-nums text-white/70">{fmtPrice(t.priceUsd)}</td>
            <td className="py-2 tabular-nums text-white/70">{t.amountTon} TON</td>
            <td className="py-2 font-mono text-white/45">{t.wallet}</td>
            <td className="py-2 text-right tabular-nums text-white/30">{fmtAgeSec(t.ageSec)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HoldersTab() {
  return (
    <div className="space-y-1">
      {HOLDERS.map((h, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-white/[0.02]">
          <span className="w-5 text-xs text-white/30">{i + 1}</span>
          <span className="font-mono text-white/55">{h.wallet}</span>
          {h.label && <span className="rounded bg-ton/10 px-1.5 py-0.5 text-[10px] font-bold text-ton-bright">{h.label}</span>}
          <span className="ml-auto tabular-nums text-white/70">{h.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function TopTradersTab() {
  return (
    <div className="space-y-1">
      {WALLETS.slice(0, 6).map((w, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-white/[0.02]">
          <span className="w-5 text-xs text-white/30">{i + 1}</span>
          <div className="min-w-0">
            <div className="font-mono text-white/55">{w.address.slice(0, 6)}…{w.address.slice(-4)}</div>
            {w.label !== "—" && <div className="text-[11px] text-white/30">{w.label}</div>}
          </div>
          <span className="ml-auto tabular-nums" style={{ color: UP }}>+{fmtUsd(w.pnl)}</span>
          <span className="w-12 text-right tabular-nums text-white/45">{w.winRate}%</span>
        </div>
      ))}
    </div>
  );
}

function InfoTab({ token }: { token: ReturnType<typeof getToken> & object }) {
  const rows = [
    ["Contract", token.address],
    ["Ticker", `$${token.ticker}`],
    ["Holders", token.holders.toLocaleString("en-US")],
    ["Status", token.graduated ? "Graduated to DEX" : "On bonding curve"],
    ["Network", "TON testnet"],
  ];
  return (
    <div className="space-y-2.5 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4">
          <span className="text-white/40">{k}</span>
          <span className="truncate font-mono text-white/70">{v}</span>
        </div>
      ))}
    </div>
  );
}
