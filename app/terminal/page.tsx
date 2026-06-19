"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  AtSign,
  Crosshair,
  Crown,
  Globe,
  Inbox,
  Send,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";
import { FINAL_STRETCH, MIGRATED, NEW_PAIRS, type PulseToken } from "@/lib/terminalMock";

const GREEN = "#10b981";
const RED = "#ef4444";
const AMBER = "#f59e0b";

type AccentKey = "blue" | "amber" | "emerald";
const ACCENTS: Record<AccentKey, { bar: string; glow: string; bg: string; text: string }> = {
  blue: { bar: "linear-gradient(180deg,#0098EA,#0066BB)", glow: "rgba(0,152,234,0.5)", bg: "rgba(0,152,234,0.12)", text: "#5bb6f0" },
  amber: { bar: "linear-gradient(180deg,#F59E0B,#B45309)", glow: "rgba(245,158,11,0.5)", bg: "rgba(245,158,11,0.12)", text: "#f0b352" },
  emerald: { bar: "linear-gradient(180deg,#10B981,#047857)", glow: "rgba(16,185,129,0.5)", bg: "rgba(16,185,129,0.12)", text: "#34d39e" },
};

/* ---------- formatters ---------- */
function money(n: number): { sym: string; val: string } {
  if (n >= 1_000_000) return { sym: "$", val: `${(n / 1_000_000).toFixed(2)}M` };
  if (n >= 1_000) return { sym: "$", val: `${(n / 1_000).toFixed(2)}K` };
  return { sym: "$", val: n.toLocaleString("en-US") };
}
function moneyStr(n: number): string {
  const m = money(n);
  return m.sym + m.val;
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
/** deterministic 24h change from the address — realistic spread, weighted small */
function changeFor(addr: string): number {
  let s = 0;
  for (let i = 0; i < addr.length; i++) s = (s * 31 + addr.charCodeAt(i)) >>> 0;
  const r = (s % 1000) / 1000;
  return Math.round((Math.pow(r, 1.7) * 320 - 28) * 10) / 10;
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

const VDivider = () => <span className="h-3 w-px shrink-0 bg-white/[0.07]" />;

function Metric({ icon: Icon, value, label }: { icon: typeof Users; value: number; label: string }) {
  return (
    <span className="flex items-center gap-0.5" title={label}>
      <Icon className="h-3 w-3 text-[#52525b]" strokeWidth={2} />
      {value}
    </span>
  );
}

/* premium token avatar: rotating gradient ring + brand drop-shadow */
function Avatar({ t }: { t: PulseToken }) {
  return (
    <span
      className="relative block h-12 w-12 shrink-0 transition-transform duration-200 group-hover:scale-105"
      style={{ filter: `drop-shadow(0 2px 8px hsl(${t.hue} 70% 45% / 0.4))` }}
    >
      <motion.span
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(from 0deg, hsl(${t.hue} 85% 58%), hsl(${(t.hue + 45) % 360} 70% 42%), hsl(${t.hue} 85% 58%))` }}
      />
      <span className="absolute inset-[2px] flex items-center justify-center rounded-full bg-[#0A0B0F] text-xl">
        {t.emoji}
      </span>
    </span>
  );
}

function ChangePill({ value }: { value: number }) {
  const up = value >= 0;
  const c = up ? GREEN : RED;
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums"
      style={{ background: `${c}1a`, color: c }}
    >
      {up ? "+" : ""}
      {value}%
    </span>
  );
}

function PulseCard({ t, extra, index, accent }: { t: PulseToken; extra: number; index: number; accent: AccentKey }) {
  const change = changeFor(t.address);
  const a = ACCENTS[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link
        href={`/terminal/token/${t.address}`}
        className="group block cursor-pointer rounded-xl border bg-gradient-to-br from-[#0F1014] to-[#0A0B0F] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 ease-out hover:-translate-y-0.5"
        style={{
          borderColor: accent === "amber" ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.06)",
          borderLeft: accent === "emerald" ? "2px solid rgba(16,185,129,0.55)" : undefined,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = a.glow;
          e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px ${a.bg}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = accent === "amber" ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
        }}
      >
        <div className="flex gap-3">
          <div className="relative">
            <Avatar t={t} />
            <span className="absolute -left-1.5 -top-1.5 z-10 rounded bg-black/80 px-1 font-mono text-[9px] font-bold tabular-nums text-white/55">
              {t.rank}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              {/* name + meta */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-display text-[15px] font-bold leading-tight text-white/95">{t.name}</span>
                  <span className="shrink-0 text-[12px] font-medium uppercase text-white/40">{t.ticker}</span>
                  <ChangePill value={change} />
                  {t.dex && <span className="shrink-0 rounded bg-ton/10 px-1 text-[9px] font-bold text-ton-bright">{t.dex}</span>}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px] tabular-nums text-[#52525b]">
                  <span className="flex items-center gap-0.5 text-white/35">
                    {accent === "blue" && <span className="text-amber-300/80">✨</span>}
                    {relAge(t.ageSec + extra)}
                  </span>
                  <VDivider />
                  <Globe className={`h-3 w-3 ${t.socials.web ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <Send className={`h-3 w-3 ${t.socials.tg ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <AtSign className={`h-3 w-3 ${t.socials.x ? "text-white/45" : "text-white/15"}`} strokeWidth={2} />
                  <VDivider />
                  <Metric icon={Users} value={t.holders} label="Holders" />
                  <Metric icon={Activity} value={t.tx} label="Transactions" />
                  <Metric icon={Crosshair} value={t.snipers} label="Snipers" />
                  <Metric icon={Crown} value={t.pro} label="Pro traders" />
                </div>
              </div>

              {/* MC hero + VOL + fees */}
              <div className="shrink-0 text-right">
                <div className="font-mono text-[15px] font-bold leading-none tabular-nums text-white/95">
                  <span className="text-white/35">$</span>
                  {money(t.mcUsd).val}
                </div>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#52525b]">Vol</span>
                  <span className="font-mono text-[11px] tabular-nums text-white/55">{moneyStr(t.volumeUsd)}</span>
                </div>
                <div className="mt-0.5 font-mono text-[10px] tabular-nums text-[#3f3f46]">
                  F {fee(t.feeTon)} · TX {t.tx}
                </div>
              </div>
            </div>

            {/* bonding progress (non-migrated) */}
            {!t.dex && (
              <div className="mt-2.5">
                <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.progress}%`,
                      background: "linear-gradient(90deg,#0098EA,#33BBFF)",
                      boxShadow: "0 0 6px rgba(0,152,234,0.6)",
                    }}
                  />
                </div>
              </div>
            )}

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
                className="flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold tabular-nums text-white transition-all duration-150 hover:scale-[1.02] active:scale-95"
                style={{
                  background: "linear-gradient(135deg,#0098EA,#0066BB)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,152,234,0.3)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,152,234,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,152,234,0.3)")}
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
  accent: AccentKey;
  tokens: PulseToken[];
  extra: number;
}) {
  const a = ACCENTS[accent];
  return (
    <div className="flex min-h-0 flex-col">
      {/* header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.05] bg-gradient-to-b from-[#0F1014] to-transparent px-3.5 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full" style={{ background: a.bar, boxShadow: `0 0 12px ${a.glow}` }} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[1.25rem] font-extrabold leading-none text-white/95">{title}</h2>
                <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums" style={{ background: a.bg, color: a.text }}>
                  {tokens.length}
                </span>
              </div>
              <p className="mt-1 text-[11px] italic text-[#52525b]">{subtitle}</p>
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
      </div>

      {/* cards */}
      <div className="term-scroll min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
        {tokens.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <Inbox className="h-7 w-7 text-white/15" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-semibold text-white/50">No tokens yet</p>
            <p className="mt-1 text-xs text-[#52525b]">Tokens will appear here when they launch</p>
          </div>
        ) : (
          tokens.map((t, i) => <PulseCard key={t.address} t={t} extra={extra} index={i} accent={accent} />)
        )}
      </div>
    </div>
  );
}

export default function Pulse() {
  const extra = useElapsed();
  const total = NEW_PAIRS.length + FINAL_STRETCH.length + MIGRATED.length;

  return (
    <div className="flex flex-col">
      {/* page title bar */}
      <div className="flex items-center justify-between border-b border-white/[0.05] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-lg font-bold text-white/95">Pulse</h1>
          <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">Mock</span>
        </div>
        <span className="flex items-center gap-2 text-xs text-[#71717A]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </span>
          Live preview
        </span>
      </div>

      {/* 3 columns with subtle gradient dividers */}
      <div className="grid h-[calc(100vh-48px-45px-26px)] grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:[&>*:not(:last-child)]:border-r xl:[&>*:not(:last-child)]:border-white/[0.04]">
        <Column title="New Pairs" subtitle="Just launched" accent="blue" tokens={NEW_PAIRS} extra={extra} />
        <Column title="Final Stretch" subtitle="Close to graduation" accent="amber" tokens={FINAL_STRETCH} extra={extra} />
        <Column title="Migrated" subtitle="Live on DEX" accent="emerald" tokens={MIGRATED} extra={extra} />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-1.5 font-mono text-[10px] text-[#3f3f46]">
        <span>◍ vynx://pulse</span>
        <span className="flex items-center gap-3 tabular-nums">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            TON · Live
          </span>
          <span>{total} tokens · mock feed</span>
        </span>
      </div>
    </div>
  );
}
