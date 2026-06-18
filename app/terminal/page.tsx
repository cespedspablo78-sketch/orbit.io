"use client";

import Link from "next/link";
import { FINAL_STRETCH, MIGRATED, NEW_PAIRS, fmtAgeSec, type PulseToken } from "@/lib/terminalMock";
import { CoinAvatar, DOWN, ICONS, TIcon, UP } from "@/components/terminal/ui";

/* dense money formatter: $43, $2.04K, $112K, $1.2M */
function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}
function fee(n: number): string {
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
function riskColor(v: number): string {
  if (v === 0) return "rgba(255,255,255,0.3)";
  if (v <= 8) return UP;
  if (v <= 18) return "#f5a623";
  return DOWN;
}
const RISK_ICONS = [ICONS.target, ICONS.users, ICONS.bolt, ICONS.star];

function Social({ on, d }: { on: boolean; d: string }) {
  return <TIcon d={d} className={`h-3 w-3 ${on ? "text-white/55" : "text-white/15"}`} />;
}

function PulseCard({ t }: { t: PulseToken }) {
  return (
    <Link
      href={`/terminal/token/${t.address}`}
      className="group flex gap-2.5 border-b border-white/[0.04] px-3 py-2.5 transition hover:bg-white/[0.025]"
    >
      {/* image + corner rank */}
      <div className="relative shrink-0">
        <CoinAvatar token={t} className="h-12 w-12 rounded-lg text-xl" />
        <span className="absolute -left-1 -top-1 rounded bg-black/75 px-1 text-[9px] font-bold tabular-nums text-white/60">
          {t.rank}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        {/* row 1 */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13px] font-bold leading-tight">{t.name}</span>
              <span className="shrink-0 text-[11px] text-white/35">{t.ticker}</span>
              {t.dex && (
                <span className="shrink-0 rounded bg-ton/10 px-1 text-[9px] font-bold text-ton-bright">{t.dex}</span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] tabular-nums text-white/35">
              <span className="font-semibold text-emerald-400">{fmtAgeSec(t.ageSec)}</span>
              <Social on={t.socials.x} d={ICONS.ext} />
              <Social on={t.socials.tg} d={ICONS.send} />
              <Social on={t.socials.web} d={ICONS.globe} />
              <span className="flex items-center gap-0.5">
                <TIcon d={ICONS.users} className="h-3 w-3 text-white/25" />
                {t.holders}
              </span>
              <span className="flex items-center gap-0.5">
                <TIcon d={ICONS.target} className="h-3 w-3 text-white/25" />
                {t.snipers}
              </span>
              <span className="flex items-center gap-0.5">
                <TIcon d={ICONS.star} className="h-3 w-3 text-white/25" />
                {t.pro}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right text-[11px] leading-tight tabular-nums">
            <div className="text-white/40">
              V <span className="font-semibold text-white/85">{money(t.volumeUsd)}</span>
            </div>
            <div className="text-white/40">
              MC <span className="font-semibold text-ton-bright">{money(t.mcUsd)}</span>
            </div>
            <div className="text-[10px] text-white/30">
              F {fee(t.feeTon)} · TX {t.tx}
            </div>
          </div>
        </div>

        {/* row 2: risk pcts + trade */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] tabular-nums">
            {t.risk.map((r, i) => (
              <span key={i} className="flex items-center gap-0.5" style={{ color: riskColor(r) }}>
                <TIcon d={RISK_ICONS[i]} className="h-3 w-3 opacity-70" />
                {r}%
              </span>
            ))}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex shrink-0 items-center gap-1 rounded-md bg-ton/15 px-2 py-1 text-[11px] font-bold tabular-nums text-ton-bright transition hover:bg-ton hover:text-white"
          >
            <TIcon d={ICONS.bolt} className="h-3 w-3" />
            {t.tradeTon} TON
          </button>
        </div>
      </div>
    </Link>
  );
}

function Column({ title, tokens, accent }: { title: string; tokens: PulseToken[]; accent?: string }) {
  return (
    <div className="flex min-h-0 flex-col border-white/[0.06] xl:border-r xl:last:border-r-0">
      {/* column header */}
      <div className="sticky top-12 z-10 flex items-center justify-between gap-2 border-b border-white/[0.06] bg-[#0A0A0B] px-3 py-2.5">
        <div className="flex items-center gap-2">
          {accent && <span className="h-2 w-2 rounded-full" style={{ background: accent }} />}
          <h2 className="text-sm font-bold">{title}</h2>
          <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white/45">
            {tokens.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/35">
          <span className="flex items-center gap-1 rounded-md border border-white/[0.06] px-1.5 py-1 text-[11px] font-semibold tabular-nums">
            <TIcon d={ICONS.bolt} className="h-3 w-3 text-ton-bright" />
            0.12
          </span>
          <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/[0.05] hover:text-white/70" aria-label="Filter">
            <TIcon d={ICONS.sliders} className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/[0.05] hover:text-white/70" aria-label="Sort">
            <TIcon d={ICONS.list} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {/* search within column */}
      <div className="border-b border-white/[0.06] px-3 py-2">
        <div className="relative">
          <TIcon d={ICONS.search} className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search by ticker or name"
            className="w-full rounded-md border border-white/[0.05] bg-[#111113] py-1.5 pl-8 pr-2 text-xs outline-none transition placeholder:text-white/20 focus:border-ton/40"
          />
        </div>
      </div>
      {/* cards */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        {tokens.map((t) => (
          <PulseCard key={t.address} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Pulse() {
  return (
    <div className="flex flex-col">
      {/* page title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold">Pulse</h1>
          <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
            Mock
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live preview
          </span>
        </div>
      </div>

      {/* 3 columns */}
      <div className="grid h-[calc(100vh-48px-49px)] grid-cols-1 xl:grid-cols-3">
        <Column title="New Pairs" tokens={NEW_PAIRS} accent="#5b8def" />
        <Column title="Final Stretch" tokens={FINAL_STRETCH} accent="#f5a623" />
        <Column title="Migrated" tokens={MIGRATED} accent={UP} />
      </div>
    </div>
  );
}
