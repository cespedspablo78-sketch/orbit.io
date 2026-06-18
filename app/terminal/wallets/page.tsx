"use client";

import { useState } from "react";
import { WALLETS } from "@/lib/terminalMock";
import { UP, DOWN } from "@/components/terminal/ui";

const fmt = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`);
const SORTS = [
  { key: "winRate", label: "Win Rate" },
  { key: "pnl", label: "P&L" },
  { key: "volume", label: "Volume" },
] as const;

export default function WalletsPage() {
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("pnl");
  const rows = [...WALLETS].sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Smart Wallets</h1>
          <p className="mt-1 text-sm text-white/40">Top performing wallets · mock data</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#111113] p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                sort === s.key ? "bg-white/[0.08] text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0E0E10]">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-wider text-white/30">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="py-3 font-medium">Wallet</th>
              <th className="py-3 font-medium">Win Rate</th>
              <th className="py-3 font-medium">P&amp;L (30d)</th>
              <th className="py-3 font-medium">Volume (30d)</th>
              <th className="py-3 font-medium">Trades</th>
              <th className="py-3 pr-4 font-medium">Recent buys</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w, i) => (
              <tr key={w.address} className="cursor-pointer border-t border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                <td className="px-4 py-3 tabular-nums text-white/30">{i + 1}</td>
                <td className="py-3">
                  <div className="font-mono text-white/70">{w.address.slice(0, 6)}…{w.address.slice(-4)}</div>
                  {w.label !== "—" && <div className="text-[11px] text-ton-bright/80">{w.label}</div>}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full" style={{ width: `${w.winRate}%`, background: UP }} />
                    </div>
                    <span className="tabular-nums text-white/70">{w.winRate}%</span>
                  </div>
                </td>
                <td className="py-3 tabular-nums font-semibold" style={{ color: w.pnl >= 0 ? UP : DOWN }}>
                  +{fmt(w.pnl)}
                </td>
                <td className="py-3 tabular-nums text-white/60">{fmt(w.volume)}</td>
                <td className="py-3 tabular-nums text-white/60">{w.trades}</td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1">
                    {w.recent.map((r) => (
                      <span key={r} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-bold text-white/55">
                        ${r}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
