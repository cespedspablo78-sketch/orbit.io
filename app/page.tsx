"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fromNano } from "@ton/core";
import { getLaunches, getTotalCoins, type TokenInfo } from "@/lib/vynxIndexer";

const MotionLink = motion(Link);

/* ---------- social links ---------- */
const TELEGRAM_URL = "https://t.me/+iwn4e-sDm31jMzQx";
const X_URL = "https://x.com/vynxjz";

/* ---------- shared motion presets ---------- */
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.21, 0.6, 0.35, 1] },
};

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay: i * 0.1, ease: [0.21, 0.6, 0.35, 1] },
});

/* ---------- brand marks ---------- */
const PlanetMark = ({ className = "h-9 w-9" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
    <defs>
      <radialGradient id="pm-g" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#33BBFF" />
        <stop offset="60%" stopColor="#0098EA" />
        <stop offset="100%" stopColor="#0055AA" />
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="10.5" fill="url(#pm-g)" />
    <ellipse cx="13" cy="15" rx="4.5" ry="2.5" fill="#BDEAFF" opacity=".55" transform="rotate(-24 13 15)" />
    <ellipse
      cx="20"
      cy="20"
      rx="18"
      ry="6.5"
      stroke="#33BBFF"
      strokeWidth="1.8"
      transform="rotate(-24 20 20)"
      className="drop-shadow-[0_0_6px_rgba(51,187,255,0.8)]"
    />
  </svg>
);

/* brand logomark — uses /public/logo.png, falls back to PlanetMark until it exists */
function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  const [ok, setOk] = useState(true);
  return ok ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="VYNX"
      onError={() => setOk(false)}
      className={`${className} object-contain`}
      style={{
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 78%)",
        maskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 78%)",
      }}
    />
  ) : (
    <PlanetMark className={className} />
  );
}

const TonShield = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
    <defs>
      <linearGradient id="ts-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#33BBFF" />
        <stop offset="100%" stopColor="#0066BB" />
      </linearGradient>
    </defs>
    <path d="M16 1 30 9v8.5C30 24.5 24 29.5 16 31 8 29.5 2 24.5 2 17.5V9L16 1z" fill="url(#ts-g)" />
    <path d="M9.5 11h13L16 22.5 9.5 11z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const TelegramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M21.9 4.4 18.6 19.8c-.25 1.1-.9 1.37-1.82.85l-5.03-3.7-2.43 2.33c-.27.27-.49.49-1.01.49l.36-5.13L17.99 6.2c.4-.36-.09-.56-.63-.2L5.83 13.26.87 11.7c-1.08-.34-1.1-1.08.22-1.6L20.5 2.6c.9-.33 1.68.2 1.4 1.8z" />
  </svg>
);

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.3l8.1-9.3L1 2h7.2l5 6.6L18.9 2zM17.7 20h1.9L7.1 3.9H5L17.7 20z" />
  </svg>
);

/* ---------- neon line icons ---------- */
const Icon = ({ d, className = "h-9 w-9 text-ton-bright" }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} drop-shadow-[0_0_10px_rgba(51,187,255,0.8)]`}
    aria-hidden
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  bolt: "M13 2 3 14h8l-1 8 11-13h-8l0-7z",
  shield: "M12 2 21 6v6c0 5-4 8.4-9 10-5-1.6-9-5-9-10V6l9-4zM8.8 9.5h6.4L12 15.5 8.8 9.5z",
  rocket: "M4.5 16.5 3 21l4.5-1.5M14 4c2.5-1.5 5.5-2 7-1 1 1.5.5 4.5-1 7-1.6 2.7-4.5 5.5-7.5 7L8 12.5C9.5 9.5 11.3 6.6 14 4zM15 9a1.5 1.5 0 1 0 .01 0M7 14l-3.5 3.5M10 17l-1 4",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  dollar: "M12 2v20M16.5 6.5c-1-1.5-2.7-2-4.5-2-2.3 0-4.2 1.1-4.2 3.1 0 4.2 8.7 2.4 8.7 6.7 0 2-1.9 3.2-4.5 3.2-1.9 0-3.7-.6-4.7-2",
  wallet: "M20 7H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14v4M2 5v14a2 2 0 0 0 2 2h18V7M16.5 14h.01",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6",
  create: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  pump: "M3 17l6-6 4 4 8-8M16 7h5v5",
} as const;

export default function Home() {
  const { launches, totalCoins, loading } = useLaunches();
  return (
    <main className="font-sans">
      <Nav />
      <Hero launches={launches} totalCoins={totalCoins} loading={loading} />
      <TrendingLaunches launches={launches} totalCoins={totalCoins} loading={loading} />
      <FeatureCards />
      <Roadmap />
      <Footer />
    </main>
  );
}

/* =================== NAV =================== */
function Nav() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-space-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <a href="#home" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <LogoMark className="h-9 w-9" />
          <span>
            VYN<span className="text-ton-bright">X</span>
          </span>
        </a>

        <ul className="hidden items-center gap-7 text-sm font-medium text-white/60 lg:flex">
          {[
            ["Launch", "/create"],
            ["Trending", "#trending"],
            ["Roadmap", "#roadmap"],
            ["Docs", "/docs"],
          ].map(([l, href]) => (
            <li key={l}>
              {href.startsWith("#") ? (
                <a href={href} className="transition hover:text-white">
                  {l}
                </a>
              ) : (
                <Link href={href} className="transition hover:text-white">
                  {l}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <motion.a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Telegram"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-space-800 text-white/80 transition hover:border-ton/50 hover:text-ton-bright"
          >
            <TelegramIcon />
          </motion.a>
          <motion.a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="X"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-space-800 text-white/80 transition hover:border-ton/50 hover:text-ton-bright"
          >
            <XIcon />
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

/* ---------- formatting helpers ---------- */
function fmtTon(nano: bigint, dp = 2): string {
  const n = Number(fromNano(nano));
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(1);
  if (n >= 1000) return `${(n / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  return n.toLocaleString("en-US", { maximumFractionDigits: dp });
}
function timeAgo(unix: number): string {
  const s = Math.max(0, Math.floor(Date.now() / 1000 - unix));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
const shortAddr = (a: string | null) => (a && a.length > 12 ? `${a.slice(0, 4)}…${a.slice(-4)}` : a ?? "—");

/* ---------- live on-chain launches (shared by hero panel + trending table) ---------- */
function useLaunches() {
  const [launches, setLaunches] = useState<TokenInfo[]>([]);
  const [totalCoins, setTotalCoins] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchAll = async () => {
      try {
        const [list, total] = await Promise.all([getLaunches(12), getTotalCoins().catch(() => null)]);
        if (!alive) return;
        setLaunches(list);
        if (total !== null) setTotalCoins(total);
      } catch (e) {
        console.error("launches fetch failed:", e);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 30000); // refetch every 30s
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return { launches, totalCoins, loading };
}

function CoinImg({ token, className = "" }: { token: TokenInfo; className?: string }) {
  const [ok, setOk] = useState(true);
  return ok && token.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={token.imageUrl} alt={token.name} onError={() => setOk(false)} className={`object-cover ${className}`} />
  ) : (
    <div className={`flex items-center justify-center bg-[#0A1220] text-sm font-bold text-ton-bright ${className}`}>
      {token.ticker?.[0] ?? "?"}
    </div>
  );
}

function Hero({
  launches,
  totalCoins,
  loading,
}: {
  launches: TokenInfo[];
  totalCoins: number | null;
  loading: boolean;
}) {
  return (
    <section id="home" className="bg-space-950 px-6 pt-24">
      <div className="mx-auto max-w-7xl">
        <StatsBar launches={launches} totalCoins={totalCoins} loading={loading} />
        <LiveLaunchesGrid launches={launches} loading={loading} />
      </div>
    </section>
  );
}

/* =================== STATS BAR =================== */
function StatsBar({
  launches,
  totalCoins,
  loading,
}: {
  launches: TokenInfo[];
  totalCoins: number | null;
  loading: boolean;
}) {
  const hasData = launches.length > 0;
  const totalReserve = launches.reduce((s, t) => s + t.reserveNano, 0n);
  const today = launches.filter((t) => Date.now() / 1000 - t.at < 86400).length;
  const active = launches.filter((t) => !t.graduated).length;

  const stats = [
    { label: "Coins Launched", value: totalCoins !== null ? totalCoins.toLocaleString("en-US") : "—" },
    { label: "Total Reserve", value: hasData ? `${fmtTon(totalReserve)} TON` : "—" },
    { label: "Tokens Today", value: hasData ? String(today) : "—" },
    { label: "Active", value: hasData ? String(active) : "—" },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0A1220] p-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ton/25 bg-ton/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80">
        <TonShield className="h-4 w-4" /> Built on TON
      </div>
      <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-xl font-bold text-white sm:text-2xl">
              {loading && !hasData && totalCoins === null ? "—" : s.value}
            </div>
            <div className="mt-0.5 text-xs text-white/40">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =================== MINI SPARKLINE (bonding curve shape) =================== */
function MiniSparkline({ progress, className = "" }: { progress: number; className?: string }) {
  const W = 120;
  const H = 40;
  const pts = Array.from({ length: 21 }, (_, i) => {
    const x = (i / 20) * W;
    const t = i / 20;
    const y = H - 3 - (H - 8) * Math.pow(t, 1.7); // accelerating bonding curve
    return [x, y] as const;
  });
  const toPath = (a: readonly (readonly [number, number])[]) =>
    a.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const k = Math.max(0, Math.min(20, Math.round((Math.min(100, Math.max(0, progress)) / 100) * 20)));
  const fill = pts.slice(0, k + 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none" aria-hidden>
      {/* full faint curve */}
      <path d={toPath(pts)} fill="none" stroke="rgba(51,187,255,0.25)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {/* progress portion: filled area + bright line */}
      {k > 0 && (
        <>
          <path d={`${toPath(fill)} L${fill[k][0].toFixed(1)} ${H} L0 ${H} Z`} fill="rgba(0,152,234,0.18)" />
          <path d={toPath(fill)} fill="none" stroke="#33BBFF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}

/* =================== LIVE LAUNCHES GRID =================== */
function VerifiedCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-ton-bright" fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 1.8 3-.3 1 2.8 2.5 1.6-1 2.8 1 2.8-2.5 1.6-1 2.8-3-.3L12 22l-2.4-1.8-3 .3-1-2.8L3.1 14l1-2.8-1-2.8 2.5-1.6 1-2.8 3 .3L12 2zm-1.2 12.9 5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3z" />
    </svg>
  );
}

function TokenCard({ t }: { t: TokenInfo }) {
  return (
    <Link
      href={`/token/${t.jetton}`}
      className="group flex flex-col rounded-2xl border border-white/[0.08] bg-[#0A1220] p-4 transition hover:border-ton/40"
    >
      <div className="flex items-center gap-3">
        <CoinImg token={t} className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-bold group-hover:text-ton-bright">{t.name}</span>
            <VerifiedCheck />
          </div>
          <div className="text-xs text-white/40">{timeAgo(t.at)}</div>
        </div>
      </div>

      <MiniSparkline progress={t.progress} className="mt-4 h-10 w-full" />

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-white/40">Market Cap</span>
        <span className="font-bold">{fmtTon(t.mcNano)} TON</span>
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Progress</span>
          <span className="font-bold text-ton-bright">{t.progress.toFixed(0)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-ton" style={{ width: `${t.progress}%` }} />
        </div>
      </div>

      <span className="mt-4 rounded-xl border border-ton/30 py-2 text-center text-xs font-bold text-ton-bright transition group-hover:bg-ton/10">
        View Launch
      </span>
    </Link>
  );
}

function PlaceholderCard() {
  return (
    <Link
      href="/create"
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0A1220]/40 p-4 text-center transition hover:border-ton/40"
    >
      <div className="text-2xl">🚀</div>
      <p className="mt-2 text-sm font-medium text-white/45">Be the next launch</p>
    </Link>
  );
}

function CtaCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-ton/20 bg-gradient-to-b from-ton/10 to-[#0A1220] p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ton/15">
        <TonShield className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold leading-tight">Launch Your Memecoin in Seconds</h3>
      <p className="mt-2 text-xs leading-relaxed text-white/50">
        Fast, secure and built for the next generation of communities.
      </p>
      <Link
        href="/create"
        className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-ton py-2.5 text-sm font-bold transition hover:bg-ton-bright active:scale-[0.98]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create Coin
      </Link>
    </div>
  );
}

function LiveLaunchesGrid({ launches, loading }: { launches: TokenInfo[]; loading: boolean }) {
  const cards = launches.slice(0, 4);
  const placeholders = Math.max(0, 4 - cards.length);

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl font-bold">Live Launches</h2>
        <span className="ml-1 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          LIVE
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading && launches.length === 0 ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-[#0A1220] p-4">
              <div className="flex items-center gap-3">
                <div className="shimmer h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-3 w-2/3 rounded" />
                  <div className="shimmer h-2 w-1/2 rounded" />
                </div>
              </div>
              <div className="shimmer mt-4 h-10 rounded" />
              <div className="shimmer mt-3 h-8 rounded" />
            </div>
          ))
        ) : (
          <>
            {cards.map((t) => (
              <TokenCard key={t.jetton} t={t} />
            ))}
            {Array.from({ length: placeholders }).map((_, i) => (
              <PlaceholderCard key={`ph-${i}`} />
            ))}
          </>
        )}
        <CtaCard />
      </div>
    </section>
  );
}

/* =================== TRENDING LAUNCHES TABLE =================== */
type SortKey = "trending" | "new" | "gainers" | "all";
const TABS: { key: SortKey; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "gainers", label: "Top Gainers" },
  { key: "all", label: "View All" },
];

function TrendingLaunches({
  launches,
  totalCoins,
  loading,
}: {
  launches: TokenInfo[];
  totalCoins: number | null;
  loading: boolean;
}) {
  const [tab, setTab] = useState<SortKey>("trending");
  const router = useRouter();

  const sorted = [...launches].sort((a, b) => {
    switch (tab) {
      case "new":
        return b.at - a.at;
      case "gainers":
      case "trending":
        return b.progress - a.progress;
      default:
        return b.at - a.at;
    }
  });

  return (
    <section id="trending" className="scroll-mt-20 bg-[#060A12] px-6 pb-16 pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight">🔥 Trending Launches</h2>
          <div className="flex flex-wrap gap-1 rounded-xl border border-white/5 bg-space-900 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  tab === t.key ? "bg-ton text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5 bg-space-950/60">
          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shimmer h-12 rounded-xl" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-20 text-center">
              <div className="text-5xl">🚀</div>
              <h3 className="mt-5 font-display text-xl font-bold">No tokens launched yet</h3>
              <p className="mt-2 text-sm text-white/45">
                Be the first to launch on VYNX{totalCoins !== null ? ` · ${totalCoins} created on-chain` : ""}
              </p>
              <Link
                href="/create"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-ton px-7 py-3.5 font-display font-bold transition hover:bg-ton-bright active:scale-[0.99]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Coin
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-white/30">
                  <th className="px-4 py-4 font-medium">#</th>
                  <th className="py-4 font-medium">Token</th>
                  <th className="hidden py-4 font-medium md:table-cell">Creator</th>
                  <th className="hidden py-4 font-medium md:table-cell">Launched</th>
                  <th className="py-4 font-medium">Market Cap</th>
                  <th className="hidden py-4 font-medium lg:table-cell">Progress</th>
                  <th className="hidden py-4 font-medium lg:table-cell">Reserve</th>
                  <th className="py-4 pr-4 font-medium" />
                </tr>
              </thead>
              <tbody>
                {sorted.map((t, i) => (
                  <motion.tr
                    key={t.jetton}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                    onClick={() => router.push(`/token/${t.jetton}`)}
                    className="cursor-pointer border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4 text-white/30">{i + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <CoinImg token={t} className="h-9 w-9 shrink-0 rounded-full" />
                        <div className="min-w-0">
                          <div className="truncate font-bold">{t.name}</div>
                          <div className="text-xs text-white/30">${t.ticker}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden py-4 md:table-cell">
                      {t.creator ? (
                        <a
                          href={`https://testnet.tonscan.org/address/${t.creator}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white/50 transition hover:text-ton-bright"
                        >
                          {shortAddr(t.creator)}
                        </a>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="hidden py-4 text-white/50 md:table-cell">{timeAgo(t.at)}</td>
                    <td className="py-4 font-display font-semibold">{fmtTon(t.mcNano)} TON</td>
                    <td className="hidden py-4 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
                          <div className="h-full rounded-full bg-ton" style={{ width: `${t.progress}%` }} />
                        </div>
                        <span className="text-xs text-white/50">{t.progress.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="hidden py-4 text-white/60 lg:table-cell">{fmtTon(t.reserveNano)} TON</td>
                    <td className="py-4 pr-4 text-right">
                      <Link
                        href={`/token/${t.jetton}`}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg border border-ton/30 px-4 py-1.5 text-xs font-bold text-ton-bright transition hover:bg-ton/10"
                      >
                        View
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

/* =================== FEATURE CARDS =================== */
const FEATURE_CARDS = [
  { icon: ICONS.bolt, title: "Instant Launch", desc: "Create and deploy your token on TON in seconds — no code, no setup." },
  { icon: ICONS.dollar, title: "Low Fees", desc: "Near-zero transaction costs. Keep more, pay less. Always." },
  { icon: ICONS.users, title: "Community First", desc: "Built for degens, by degens — designed for the next generation of communities." },
];

function FeatureCards() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-space-950 px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-3">
        {FEATURE_CARDS.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/[0.08] bg-[#0A1220] p-6 transition hover:border-ton/30">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ton/10">
              <Icon d={f.icon} className="h-5 w-5 text-ton-bright" />
            </span>
            <h3 className="mt-5 font-display text-lg font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =================== ROADMAP =================== */
const PHASES = [
  {
    phase: "Phase 1",
    when: "Now",
    title: "Landing + Waitlist",
    active: true,
    items: ["Website live", "Waitlist open", "Socials active"],
  },
  {
    phase: "Phase 2",
    when: "Q3 2026",
    title: "Beta",
    active: false,
    items: ["Testnet contracts", "Token creation", "Bonding curve"],
  },
  {
    phase: "Phase 3",
    when: "Q4 2026",
    title: "Launch",
    active: false,
    items: ["Mainnet", "STON.fi integration", "Leaderboards"],
  },
  {
    phase: "Phase 4",
    when: "2027",
    title: "Mini App",
    active: false,
    items: ["Launch from Telegram", "In-chat trading", "Auto communities"],
  },
];

function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-16 bg-space-900 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.25em] text-ton-bright/80">
          Roadmap
        </motion.p>
        <motion.h2 {...fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Built in public.
        </motion.h2>
        <motion.p {...fadeUp} className="mt-4 text-white/45">
          Every step, every ship.
        </motion.p>

        <div className="relative mt-24">
          {/* timeline line — animates left to right */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-[rgba(0,152,234,0.25)] lg:block"
          />

          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((p, i) => (
              <motion.div key={p.phase} {...stagger(i)}>
                <span
                  className={`relative z-10 block h-[11px] w-[11px] rounded-full ${
                    p.active ? "bg-ton-bright shadow-[0_0_14px_#33BBFF]" : "bg-ton/25"
                  }`}
                >
                  {p.active && <span className="absolute inset-0 animate-ping rounded-full bg-ton-bright/60" />}
                </span>
                <p
                  className={`mt-6 text-xs font-bold uppercase tracking-[0.2em] ${
                    p.active ? "text-ton-bright" : "text-white/35"
                  }`}
                >
                  {p.phase} — {p.when}
                </p>
                <h3 className={`mt-2 font-display text-xl font-bold ${p.active ? "text-white" : "text-white/60"}`}>
                  {p.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className={`text-sm ${p.active ? "text-white/55" : "text-white/30"}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== FOOTER =================== */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-space-950 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <a href="#home" className="flex items-center gap-2 font-display font-bold">
          <LogoMark className="h-7 w-7" />
          VYN<span className="text-ton-bright">X</span>
        </a>
        <div className="flex gap-8 text-sm font-medium text-white/45">
          {[
            ["Waitlist", "/launch"],
            ["Docs", "/docs"],
          ].map(([l, href]) => (
            <Link key={l} href={href} className="transition hover:text-white">
              {l}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4 text-white/45">
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="transition hover:text-ton-bright">
            <TelegramIcon className="h-4 w-4" />
          </a>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X" className="transition hover:text-ton-bright">
            <XIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-white/25">© 2026 VYNX — Every token takes orbit.</p>
    </footer>
  );
}
