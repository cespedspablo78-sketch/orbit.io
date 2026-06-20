"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Radio, Zap } from "lucide-react";
import { FINAL_STRETCH, MIGRATED, NEW_PAIRS, type PulseToken } from "@/lib/terminalMock";

const GREEN = "#10b981";
const RED = "#ef4444";

/* ---------- formatters (all numbers are mono + tabular) ---------- */
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
  return `hsl(${s % 360} 28% 26%)`;
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

function Avatar({ t }: { t: PulseToken }) {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-semibold text-white/85"
      style={{ background: avatarColor(t.address), borderRadius: 4 }}
    >
      {t.ticker.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ChgPill({ value }: { value: number }) {
  const up = value >= 0;
  const c = up ? GREEN : RED;
  return (
    <span
      className="shrink-0 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums"
      style={{ background: `${c}1a`, color: c, borderRadius: 4 }}
    >
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
      className="inline-flex shrink-0 items-center gap-1 bg-ton px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-white transition-colors duration-100 hover:bg-[#1AA5EE] active:bg-[#0086D2]"
      style={{ borderRadius: 4 }}
    >
      <Zap className="h-3 w-3" fill="currentColor" strokeWidth={0} />
      {amount}
    </button>
  );
}

function Row({ t, extra }: { t: PulseToken; extra: number }) {
  const chg = changeFor(t.address);
  return (
    <Link
      href={`/terminal/token/${t.address}`}
      className="group block border-b border-white/[0.04] px-4 py-2 transition-colors duration-100 hover:bg-white/[0.02]"
    >
      <div className="flex items-center gap-3">
        <Avatar t={t} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-semibold leading-tight text-white/90">{t.name}</span>
            <span className="shrink-0 font-mono text-[11px] uppercase text-white/45">${t.ticker}</span>
            <span className="shrink-0 font-mono text-[11px] text-white/30">· {relAge(t.ageSec + extra)}</span>
          </div>
          <div className="mt-0.5 font-mono text-[10px] tabular-nums text-white/35">
            V {vol(t.volumeUsd)} · TX {t.tx} · H {t.holders} · S {t.snipers}
          </div>
        </div>
        <span className="shrink-0 font-mono text-[14px] font-semibold tabular-nums text-white/90">{mc(t.mcUsd)}</span>
        <ChgPill value={chg} />
        <Buy amount={t.tradeTon} />
      </div>
    </Link>
  );
}

function Column({ title, subtitle, tokens, extra }: { title: string; subtitle: string; tokens: PulseToken[]; extra: number }) {
  return (
    <div className="flex min-h-0 flex-col">
      {/* terminal header — pure typography, hairline above + below */}
      <div className="border-y border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">{title}</span>
          <span className="font-mono text-[11px] tabular-nums text-white/40">{String(tokens.length).padStart(2, "0")}</span>
        </div>
        <p className="mt-0.5 text-[10px] italic text-white/40">{subtitle}</p>
      </div>

      <div className="term-scroll min-h-0 flex-1 overflow-y-auto">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Radio className="h-4 w-4 text-white/20" strokeWidth={1.75} />
            <p className="mt-3 font-mono text-[11px] text-white/40">Watching for new launches</p>
          </div>
        ) : (
          tokens.map((t) => <Row key={t.address} t={t} extra={extra} />)
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
      {/* page title — small, no big masthead */}
      <div className="px-4 pb-2.5 pt-3">
        {/* one composition line, top-left. no reason. */}
        <div className="h-px w-6 bg-ton" />
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">Pulse</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-white/35">
            <span className="h-1.5 w-1.5 rounded-full bg-ton" />
            live · {total} tokens · TON mainnet
          </span>
        </div>
      </div>

      {/* 3 columns, 1px vertical dividers */}
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-white/[0.06]">
        <Column title="New Pairs" subtitle="Just launched on bonding" tokens={NEW_PAIRS} extra={extra} />
        <Column title="Final Stretch" subtitle="Close to graduation" tokens={FINAL_STRETCH} extra={extra} />
        <Column title="Migrated" subtitle="Live on DEX" tokens={MIGRATED} extra={extra} />
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
