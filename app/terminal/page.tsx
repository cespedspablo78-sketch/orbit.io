"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, SlidersHorizontal, Zap } from "lucide-react";
import { FINAL_STRETCH, MIGRATED, NEW_PAIRS, type PulseToken } from "@/lib/terminalMock";

const GREEN = "#22C55E";
const RED = "#EF4444";

type ColKind = "new" | "final" | "migrated";

/* ---------- formatters (mono + tabular everywhere) ---------- */
function mc(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}
function vol(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n}`;
}
function relAge(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
function changeFor(addr: string): number {
  let s = 0;
  for (let i = 0; i < addr.length; i++) s = (s * 31 + addr.charCodeAt(i)) >>> 0;
  const r = (s % 1000) / 1000;
  return Math.round((Math.pow(r, 1.7) * 320 - 28) * 10) / 10;
}
function avatarColor(addr: string): string {
  let s = 0;
  for (let i = 0; i < addr.length; i++) s = (s * 31 + addr.charCodeAt(i)) >>> 0;
  return `hsl(${s % 360} 42% 30%)`;
}

function useElapsed(): number {
  const start = useRef(Date.now());
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return Math.floor((Date.now() - start.current) / 1000);
}

function TokenImage({ t }: { t: PulseToken }) {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center text-[15px] font-semibold text-white/90"
      style={{ background: avatarColor(t.address), borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {t.ticker.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ChgPill({ value }: { value: number }) {
  const up = value >= 0;
  const c = up ? GREEN : RED;
  return (
    <span className="font-mono text-[11px] font-semibold tabular-nums" style={{ background: `${c}1a`, color: c, borderRadius: 4, padding: "2px 6px" }}>
      {up ? "+" : ""}
      {value}%
    </span>
  );
}

function Buy({ amount }: { amount: number }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="inline-flex shrink-0 items-center gap-1 bg-ton px-3 py-1.5 font-mono text-[11px] font-semibold tabular-nums text-white transition-[background-color,transform] duration-150 hover:scale-[1.02] hover:bg-[#1AA5EE] active:scale-100"
      style={{ borderRadius: 6 }}
    >
      <Zap className="h-3 w-3" fill="currentColor" strokeWidth={0} />
      {amount}
    </button>
  );
}

function Card({ t, extra, index, kind }: { t: PulseToken; extra: number; index: number; kind: ColKind }) {
  const chg = changeFor(t.address);
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index * 0.04, 0.4) }}>
      <Link
        href={`/terminal/token/${t.address}`}
        className="group block border bg-[#0A0F1A] p-3 transition-[background-color,border-color] duration-150 hover:border-ton/30 hover:bg-[#0D1422]"
        style={{ borderColor: "rgba(255,255,255,0.06)", borderRadius: 8 }}
      >
        <div className="flex gap-3">
          <TokenImage t={t} />
          <div className="flex min-h-[56px] min-w-0 flex-1 flex-col justify-between">
            {/* top: name/ticker/time + mc/change */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-[14px] font-semibold leading-tight text-white/90">{t.name}</span>
                  <span className="shrink-0 font-mono text-[11px] uppercase text-white/45">${t.ticker}</span>
                  {kind === "migrated" && t.dex && (
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-wide text-white/50" style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 3, padding: "1px 4px" }}>
                      {t.dex}
                    </span>
                  )}
                </div>
                <div className="mt-1 font-mono text-[11px] text-white/40">
                  {relAge(t.ageSec + extra)} <span className="text-white/20">·</span> TON
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-mono text-[14px] font-bold tabular-nums text-white/95">{mc(t.mcUsd)}</div>
                <div className="mt-1">
                  <ChgPill value={chg} />
                </div>
              </div>
            </div>

            {/* bottom: metrics + buy */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="font-mono text-[11px] tabular-nums text-white/45">
                <span title="Volume">V {vol(t.volumeUsd)}</span> <span className="text-white/20">·</span>{" "}
                <span title="Transactions">TX {t.tx}</span> <span className="text-white/20">·</span>{" "}
                <span title="Holders">H {t.holders}</span> <span className="text-white/20">·</span>{" "}
                <span title="Snipers">S {t.snipers}</span>
              </div>
              <Buy amount={t.tradeTon} />
            </div>
          </div>
        </div>

        {/* final stretch: bonding progress (full card width) */}
        {kind === "final" && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-0.5 flex-1 overflow-hidden bg-white/[0.05]">
              <div className="h-full bg-ton" style={{ width: `${t.progress}%` }} />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-white/50">{t.progress}%</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

function Column({ title, subtitle, tokens, extra, kind }: { title: string; subtitle: string; tokens: PulseToken[]; extra: number; kind: ColKind }) {
  return (
    <div className="flex min-h-0 flex-col">
      {/* header */}
      <div className="border-b border-white/[0.06] px-3.5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-white/80">{title}</span>
            <span className="font-mono text-[11px] tabular-nums text-white/35">{String(tokens.length).padStart(2, "0")}</span>
          </div>
          <div className="flex items-center gap-0.5 text-white/25">
            <button className="flex h-6 w-6 items-center justify-center transition-colors hover:text-white/60" title="Filter">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button className="flex h-6 w-6 items-center justify-center transition-colors hover:text-white/60" title="Sort">
              <ArrowDownUp className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <p className="mt-0.5 text-[10px] italic text-white/40">{subtitle}</p>
      </div>

      {/* cards */}
      <div className="term-scroll min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <p className="mt-3 font-mono text-[11px] text-white/40">Watching for new launches</p>
          </div>
        ) : (
          tokens.map((t, i) => <Card key={t.address} t={t} extra={extra} index={i} kind={kind} />)
        )}
      </div>
    </div>
  );
}

export default function Pulse() {
  const extra = useElapsed();
  const total = NEW_PAIRS.length + FINAL_STRETCH.length + MIGRATED.length;
  const sync = (extra % 9) + 1;

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col">
      {/* page title bar */}
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">Pulse</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          live · {total} tokens · TON mainnet
        </span>
      </div>

      {/* 3 columns */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-white/[0.06]">
        <Column title="New Pairs" subtitle="Just launched on bonding" tokens={NEW_PAIRS} extra={extra} kind="new" />
        <Column title="Final Stretch" subtitle="Close to graduation" tokens={FINAL_STRETCH} extra={extra} kind="final" />
        <Column title="Migrated" subtitle="Live on DEX" tokens={MIGRATED} extra={extra} kind="migrated" />
      </div>

      {/* status bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-1.5 font-mono text-[10px] tabular-nums text-white/40">
        <span>TON · live · {total} tokens · 60fps · mock feed</span>
        <span>
          sync {sync}s ago<span className="term-cursor" />
        </span>
      </div>
    </div>
  );
}
