"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownUp, SlidersHorizontal, Zap } from "lucide-react";
import { ACTIVITY, FINAL_STRETCH, MIGRATED, NEW_PAIRS, type PulseToken } from "@/lib/terminalMock";

const GREEN = "#10b981";
const RED = "#ef4444";
const CREAM = "#EDE5D8";

/* ---------- formatters ---------- */
function mcShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toLocaleString("en-US");
}
function volShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
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
function hueFromHash(addr: string): [number, number] {
  let s = 0;
  for (let i = 0; i < addr.length; i++) s = (s * 31 + addr.charCodeAt(i)) >>> 0;
  const h1 = s % 360;
  const h2 = (h1 + 35 + (s % 50)) % 360;
  return [h1, h2];
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

/* geometric avatar — deterministic gradient + ticker letter, sharp-ish corners */
function Avatar({ t, size }: { t: PulseToken; size: number }) {
  const [h1, h2] = hueFromHash(t.address);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg font-semibold text-white/90"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(135deg, hsl(${h1} 42% 30%), hsl(${h2} 46% 15%))`,
      }}
    >
      {t.ticker[0]}
    </div>
  );
}

function Chg({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`shrink-0 font-mono tabular-nums ${className}`} style={{ color: value >= 0 ? GREEN : RED }}>
      {value >= 0 ? "+" : ""}
      {value}%
    </span>
  );
}

/* the ONE colourful element — solid blue, single glow, sharp corners */
function Buy({ amount }: { amount: number }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="inline-flex shrink-0 items-center gap-1 bg-ton px-3 py-1.5 font-mono text-[11px] font-semibold tabular-nums text-white transition-colors duration-100 hover:bg-ton-bright active:translate-y-px"
      style={{ borderRadius: 4, boxShadow: "0 0 18px rgba(0,152,234,0.35)" }}
    >
      <Zap className="h-3 w-3" fill="currentColor" strokeWidth={0} />
      {amount}
    </button>
  );
}

/* lead card — the column's "front page story" */
function LeadCard({ t, extra }: { t: PulseToken; extra: number }) {
  const chg = changeFor(t.address);
  return (
    <Link href={`/terminal/token/${t.address}`} className="group block px-3.5 py-4 transition-colors duration-100 hover:bg-white/[0.02]">
      <div className="flex gap-3">
        <Avatar t={t} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[16px] font-medium leading-tight" style={{ color: CREAM }}>{t.name}</span>
            <Chg value={chg} className="text-[12px]" />
            {t.dex && <span className="ml-auto font-mono text-[10px] text-white/30">{t.dex}</span>}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-white/35">
            ${t.ticker} <span className="text-white/20">·</span> <span className="italic">{relAge(t.ageSec + extra)}</span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <div className="font-mono text-[22px] font-black leading-none tabular-nums" style={{ color: CREAM }}>
                <span className="text-white/25">$</span>
                {mcShort(t.mcUsd)}
              </div>
              <div className="mt-1.5 font-mono text-[11px] tabular-nums text-white/45">
                <span className="small-caps mr-1 text-white/30">vol</span>${volShort(t.volumeUsd)}
              </div>
            </div>
            <Buy amount={t.tradeTon} />
          </div>

          {!t.dex && (
            <div className="mt-3 h-px w-full bg-white/[0.05]">
              <div className="h-px bg-ton" style={{ width: `${t.progress}%` }} />
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 border-t border-white/[0.04] pt-3 font-mono text-[10px] tabular-nums text-white/35">
            <span title="Holders">H {t.holders}</span>
            <span title="Transactions">T {t.tx}</span>
            <span title="Snipers">S {t.snipers}</span>
            <span title="Pro traders">P {t.pro}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* compact row */
function Row({ t, extra }: { t: PulseToken; extra: number }) {
  const chg = changeFor(t.address);
  return (
    <Link href={`/terminal/token/${t.address}`} className="group flex items-center gap-3 px-3.5 py-2.5 transition-colors duration-100 hover:bg-white/[0.02]">
      <Avatar t={t} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[14px] leading-tight" style={{ color: CREAM }}>{t.name}</span>
          <Chg value={chg} className="text-[11px]" />
        </div>
        <div className="font-mono text-[10px] text-white/30">
          ${t.ticker} <span className="text-white/15">·</span> <span className="italic">{relAge(t.ageSec + extra)}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-[14px] font-semibold tabular-nums" style={{ color: CREAM }}>
          <span className="text-white/25">$</span>
          {mcShort(t.mcUsd)}
        </div>
        <div className="font-mono text-[10px] tabular-nums text-white/35">
          <span className="small-caps mr-1 text-white/25">vol</span>${volShort(t.volumeUsd)}
        </div>
      </div>
      <Buy amount={t.tradeTon} />
    </Link>
  );
}

function Column({ title, subtitle, tokens, extra }: { title: string; subtitle: string; tokens: PulseToken[]; extra: number }) {
  return (
    <div className="flex min-h-0 flex-col">
      {/* typographic header */}
      <div className="border-b border-white/[0.06] px-3.5 pb-2.5 pt-3.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/65">{title}</span>
          <span className="font-mono text-[11px] tabular-nums text-white/30">· {String(tokens.length).padStart(2, "0")}</span>
          <div className="ml-auto flex items-center gap-0.5 text-white/25">
            <button className="flex h-6 w-6 items-center justify-center transition-colors hover:text-white/60" title="Filter">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button className="flex h-6 w-6 items-center justify-center transition-colors hover:text-white/60" title="Sort">
              <ArrowDownUp className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
        <p className="mt-1 text-[11px] italic text-white/30">{subtitle}</p>
      </div>

      {/* rows on hairlines */}
      <div className="term-scroll min-h-0 flex-1 divide-y divide-white/[0.04] overflow-y-auto">
        {tokens.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-white/40">No tokens yet</p>
            <p className="mt-1 text-xs italic text-white/25">they’ll appear here when they launch</p>
          </div>
        ) : (
          tokens.map((t, i) => (
            <motion.div key={t.address} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
              {i === 0 ? <LeadCard t={t} extra={extra} /> : <Row t={t} extra={extra} />}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* live trade ticker — the one bold, useful element */
function Ticker() {
  const items = [...ACTIVITY, ...ACTIVITY];
  return (
    <div className="overflow-hidden border-b border-white/[0.06] bg-white/[0.012]">
      <div className="term-marquee flex w-max items-center gap-7 whitespace-nowrap py-1.5 font-mono text-[11px] tabular-nums">
        {items.map((a, i) => (
          <span key={i} className="flex items-center gap-1.5 text-white/40">
            <span style={{ color: a.side === "buy" ? GREEN : RED }}>{a.side === "buy" ? "▲" : "▼"}</span>
            <span className="text-white/55">{a.wallet}</span>
            <span className="text-white/30">{a.side === "buy" ? "bought" : "sold"}</span>
            <span style={{ color: CREAM }}>${a.ticker}</span>
            <span>{a.amountTon} TON</span>
            <span className="text-white/15">—</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Pulse() {
  const extra = useElapsed();
  const total = NEW_PAIRS.length + FINAL_STRETCH.length + MIGRATED.length;
  const sync = extra % 9;

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col">
      {/* masthead */}
      <div className="flex items-end justify-between border-b border-white/[0.06] px-4 pb-3.5 pt-4">
        <div>
          <h1 className="text-[26px] font-bold leading-none tracking-tight" style={{ color: CREAM }}>
            VYNX <span className="text-white/55">TERMINAL</span>
          </h1>
          <p className="mt-1.5 text-[13px] text-white/40">Live memecoin discovery on TON</p>
        </div>
        <span className="hidden items-center gap-2 text-[11px] italic text-white/35 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          live preview <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] not-italic uppercase tracking-wider text-amber-300">mock</span>
        </span>
      </div>

      {/* ticker */}
      <Ticker />

      {/* 3 columns on vertical hairlines */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-white/[0.06]">
        <Column title="New Pairs" subtitle="just launched" tokens={NEW_PAIRS} extra={extra} />
        <Column title="Final Stretch" subtitle="close to graduation" tokens={FINAL_STRETCH} extra={extra} />
        <Column title="Migrated" subtitle="live on DEX" tokens={MIGRATED} extra={extra} />
      </div>

      {/* terminal status bar */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-1.5 font-mono text-[10px] tabular-nums text-white/30">
        <span>TON · live · {total} tokens · mock feed · last sync {sync}s</span>
        <span className="term-cursor text-white/25">vynx://pulse · 60 fps · running clean</span>
      </div>
    </div>
  );
}
