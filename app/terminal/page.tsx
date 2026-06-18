"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ACTIVITY, TOKENS, fmtAge, fmtAgeSec, fmtPrice, fmtUsd } from "@/lib/terminalMock";
import { Change, CoinAvatar, DOWN, ICONS, TIcon, UP } from "@/components/terminal/ui";

type Tab = "memecoins" | "graduated";

export default function TerminalDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("memecoins");
  const rows = TOKENS.filter((t) => (tab === "graduated" ? t.graduated : !t.graduated));

  return (
    <div className="grid grid-cols-1 gap-px xl:grid-cols-[1fr,320px]">
      {/* ===== center: token list ===== */}
      <div className="min-w-0 px-4 py-5 sm:px-6">
        {/* tabs */}
        <div className="flex items-center gap-1 border-b border-white/[0.06] pb-px">
          {([
            ["memecoins", "Memecoins"],
            ["graduated", "Graduated"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative px-4 py-2.5 text-sm font-semibold transition ${
                tab === key ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {label}
              {tab === key && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-ton" />}
            </button>
          ))}
        </div>

        {/* table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-white/30">
                <th className="pb-3 pl-2 font-medium">Token</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">24h</th>
                <th className="pb-3 font-medium">MC</th>
                <th className="pb-3 font-medium">Vol</th>
                <th className="pb-3 font-medium">{tab === "graduated" ? "Liquidity" : "Bonding"}</th>
                <th className="pb-3 pr-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.address}
                  onClick={() => router.push(`/terminal/token/${t.address}`)}
                  className="cursor-pointer border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                >
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <CoinAvatar token={t} className="h-9 w-9 text-base" />
                      <div className="min-w-0">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-white/35">
                          ${t.ticker} · {fmtAge(t.ageMin)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="tabular-nums font-medium">{fmtPrice(t.price)}</td>
                  <td>
                    <Change value={t.change24h} />
                  </td>
                  <td className="tabular-nums text-white/70">{fmtUsd(t.mc)}</td>
                  <td className="tabular-nums text-white/70">{fmtUsd(t.volume24h)}</td>
                  <td>
                    {t.graduated ? (
                      <span className="tabular-nums text-white/70">{fmtUsd(t.liquidity)}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-ton" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="tabular-nums text-xs text-white/45">{t.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg border border-ton/30 px-3 py-1.5 text-xs font-bold text-ton-bright transition hover:bg-ton hover:text-white"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== right: activity feed ===== */}
      <aside className="border-t border-white/[0.06] px-4 py-5 sm:px-6 xl:border-l xl:border-t-0">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Live Activity</h2>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE
          </span>
        </div>
        <p className="mt-1 text-[11px] text-white/30">Trades from tracked wallets · mock</p>

        <div className="mt-4 space-y-1">
          {ACTIVITY.map((a) => (
            <div key={a.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs transition hover:bg-white/[0.02]">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                style={{ background: `${a.side === "buy" ? UP : DOWN}1f`, color: a.side === "buy" ? UP : DOWN }}
              >
                {a.side === "buy" ? "B" : "S"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate">
                  <span className="font-mono text-white/50">{a.wallet}</span>{" "}
                  <span style={{ color: a.side === "buy" ? UP : DOWN }}>{a.side === "buy" ? "bought" : "sold"}</span>{" "}
                  <span className="font-semibold">${a.ticker}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="tabular-nums font-medium">{a.amountTon} TON</div>
                <div className="tabular-nums text-white/30">{fmtAgeSec(a.ageSec)}</div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/terminal/wallets"
          className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] py-2 text-xs font-medium text-white/55 transition hover:border-ton/40 hover:text-white"
        >
          <TIcon d={ICONS.wallets} className="h-4 w-4" /> Track smart wallets
        </Link>
      </aside>
    </div>
  );
}
