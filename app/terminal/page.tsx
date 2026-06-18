"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownUp,
  AtSign,
  Crosshair,
  Globe,
  Inbox,
  Send,
  SlidersHorizontal,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { FINAL_STRETCH, MIGRATED, NEW_PAIRS, type PulseToken } from "@/lib/terminalMock";
import { CoinAvatar } from "@/components/terminal/ui";

const GREEN = "#10b981";
const RED = "#ef4444";
const AMBER = "#f59e0b";

/* dense money formatter: $43, $2.04K, $1.2M */
function money(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toLocaleString("en-US")}`;
}
function fee(n: number): string {
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
function relAge(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
function riskColor(v: number): string {
  if (v === 0) return "#52525b";
  if (v <= 8) return GREEN;
  if (v <= 18) return AMBER;
  return RED;
}

/** seconds elapsed since first mount — drives the ticking timestamps */
function useElapsed(): number {
  const start = useRef(Date.now());
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return Math.floor((Date.now() - start.current) / 1000);
}

const Dot = () => <span className="h-3 w-px shrink-0 bg-white/[0.08]" />;

function MetricIcon({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <span className="flex items-center gap-0.5" title={label}>
      <Icon className="h-3 w-3 text-[#52525b]" strokeWidth={2} />
      {value}
    </span>
  );
}

function PulseCard({ t, extra, index }: { t: PulseToken; extra: number; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut", delay: Math.min(index * 0.025, 0.3) }}
    >
      <Link
        href={`/terminal/token/${t.address}`}
        className="group block border-b border-l-2 border-l-transparent border-b-white/[0.04] px-3.5 py-3 transition-[background-color,border-color] duration-150 hover:border-l-ton hover:bg-[rgba(0,152,234,0.03)]"
      >
        <div className="flex gap-3">
          {/* image + rank */}
          <div className="relative shrink-0">
            <CoinAvatar token={t} className="h-11 w-11 rounded-lg text-xl ring-1 ring-white/[0.06]" />
            <span className="absolute -left-1 -top-1 rounded bg-black/80 px-1 font-mono text-[9px] font-bold tabular-nums text-white/55">
              {t.rank}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              {/* name + meta */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-display text-[15px] font-bold leading-tight text-[#FAFAFA]">{t.name}</span>
                  <span className="shrink-0 text-[12px] font-medium text-[#71717A]">{t.ticker}</span>
                  {t.dex && (
                    <span className="shrink-0 rounded bg-ton/10 px-1 text-[9px] font-bold text-ton-bright">{t.dex}</span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-[#52525b]">
                  <span className="text-[#71717A]">{relAge(t.ageSec + extra)}</span>
                  <Dot />
                  <Globe className={`h-3 w-3 ${t.socials.web ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <Send className={`h-3 w-3 ${t.socials.tg ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <AtSign className={`h-3 w-3 ${t.socials.x ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <Dot />
                  <MetricIcon icon={Users} value={t.holders} label="Holders" />
                  <MetricIcon icon={Crosshair} value={t.snipers} label="Snipers" />
                  <MetricIcon icon={Star} value={t.pro} label="Pro traders" />
                </div>
              </div>

              {/* MC (biggest) + VOL + fees */}
              <div className="shrink-0 text-right">
                <div className="font-mono text-[15px] font-bold leading-none tabular-nums text-[#FAFAFA]">{money(t.mcUsd)}</div>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.05em] text-[#52525b]">Vol</span>
                  <span className="font-mono text-[11px] tabular-nums text-white/65">{money(t.volumeUsd)}</span>
                </div>
                <div className="mt-0.5 font-mono text-[10px] tabular-nums text-[#3f3f46]">
                  F {fee(t.feeTon)} · TX {t.tx}
                </div>
              </div>
            </div>

            {/* risk + buy */}
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 font-mono text-[10px] tabular-nums">
                {t.risk.map((r, i) => (
                  <span key={i} style={{ color: riskColor(r) }}>
                    {r}%
                  </span>
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex shrink-0 items-center gap-1 rounded-md bg-gradient-to-b from-ton to-ton-deep px-2.5 py-1 font-mono text-[11px] font-bold tabular-nums text-white shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:shadow-[0_2px_12px_rgba(0,152,234,0.5)] active:scale-95"
              >
                <Zap className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                {t.tradeTon} TON
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Column({
  title,
  subtitle,
  accent,
  tokens,
  extra,
}: {
  title: string;
  subtitle: string;
  accent: string;
  tokens: PulseToken[];
  extra: number;
}) {
  return (
    <div className="relative flex min-h-0 flex-col">
      {/* column header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-white/[0.05] bg-[#08090B]/95 px-3.5 py-3 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-[3px] rounded-full" style={{ background: accent }} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[1.05rem] font-bold leading-none text-[#FAFAFA]">{title}</h2>
              <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-white/50">
                {tokens.length}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#52525b]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-[#52525b]">
          <button className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/[0.05] hover:text-white/70" title="Filter">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/[0.05] hover:text-white/70" title="Sort">
            <ArrowDownUp className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* cards */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <Inbox className="h-7 w-7 text-white/15" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-semibold text-white/50">No tokens yet</p>
            <p className="mt-1 text-xs text-[#52525b]">Tokens will appear here when they launch</p>
          </div>
        ) : (
          tokens.map((t, i) => <PulseCard key={t.address} t={t} extra={extra} index={i} />)
        )}
      </div>
    </div>
  );
}

export default function Pulse() {
  const extra = useElapsed();

  return (
    <div className="flex flex-col bg-[#08090B]">
      {/* page title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold text-[#FAFAFA]">Pulse</h1>
          <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
            Mock
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#71717A]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live preview
        </span>
      </div>

      {/* 3 columns with gradient dividers */}
      <div className="grid h-[calc(100vh-48px-45px-26px)] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-white/[0.04]">
        <Column title="New Pairs" subtitle="Just launched" accent="#0098EA" tokens={NEW_PAIRS} extra={extra} />
        <Column title="Final Stretch" subtitle="Close to graduation" accent="#f59e0b" tokens={FINAL_STRETCH} extra={extra} />
        <Column title="Migrated" subtitle="Live on DEX" accent="#10b981" tokens={MIGRATED} extra={extra} />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-1.5 font-mono text-[10px] text-[#3f3f46]">
        <span>◍ vynx://pulse</span>
        <span className="tabular-nums">{NEW_PAIRS.length + FINAL_STRETCH.length + MIGRATED.length} tokens · mock feed</span>
      </div>
    </div>
  );
}
