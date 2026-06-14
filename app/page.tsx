"use client";

import { animate, motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Mascot from "@/components/Mascot";

const MotionLink = motion(Link);

/* ---------- social links ---------- */
const TELEGRAM_URL = "https://t.me/+iwn4e-sDm31jMzQx";
const X_URL = "https://x.com/vynxjz";

/* real-time 3D hero scene — client-only, never SSR'd */
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

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
  return (
    <main className="font-sans">
      <Nav />
      <Hero />
      <HowItWorks />
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
            ["Launch", "/launch"],
            ["How It Works", "#how-it-works"],
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

/* =================== HERO =================== */
const FEATURES = [
  { icon: ICONS.bolt, title: "Instant Launch", desc: "Create your token in seconds." },
  { icon: ICONS.shield, title: "Built on TON", desc: "Fast, secure and extremely low fees." },
  { icon: ICONS.dollar, title: "Low Fees", desc: "Keep more, pay less. Always." },
  { icon: ICONS.users, title: "Community First", desc: "Built for degens, by degens." },
];

const STATS: { icon: string; to: number; label: string; format: (n: number) => string }[] = [
  { icon: ICONS.rocket, to: 12543, label: "Coins Launched", format: (n) => Math.round(n).toLocaleString("en-US") },
  { icon: ICONS.users, to: 78932, label: "Traders", format: (n) => Math.round(n).toLocaleString("en-US") },
  { icon: ICONS.dollar, to: 24.6, label: "Total Volume", format: (n) => `$${n.toFixed(1)}M` },
  { icon: ICONS.wallet, to: 58341, label: "Holders", format: (n) => Math.round(n).toLocaleString("en-US") },
];

function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: setVal });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{format(val)}</span>;
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-space-950 pt-16">
      {/* ===== real-time 3D scene (stars, nebula, fog, coins, rings, platform) ===== */}
      <div className="absolute inset-0">
        <Scene3D />
      </div>
      {/* subtle grid over the scene */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />

      {/* ===== content ===== */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-2 lg:pt-6">
        {/* left column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-ton/25 bg-space-800/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/85"
          >
            <TonShield className="h-4 w-4" />
            Built on TON
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ton-bright" />
          </motion.div>

          <h1
            className="font-sans font-black text-white"
            style={{ fontSize: "clamp(3.2rem, 6vw, 5.5rem)", letterSpacing: "-3px", lineHeight: 1.0 }}
          >
            {["Launch", "Memecoins"].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
              className="block"
            >
              In <span className="text-glow text-ton">Seconds.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-7 max-w-md text-[1.1rem] leading-relaxed text-white/55"
          >
            The fastest and easiest way to launch, trade and discover memecoins on TON.
          </motion.p>

          {/* buttons */}
          <motion.div
            id="launch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <MotionLink
              href="/create"
              whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(0,152,234,0.7)" }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-2.5 overflow-hidden rounded-xl bg-ton px-10 py-4 font-display text-lg font-bold shadow-glow-md"
            >
              <motion.span
                aria-hidden
                animate={{ x: ["-180%", "280%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8 }}
                className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-white/25 blur-sm"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="relative h-5 w-5" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="relative">Create Coin</span>
            </MotionLink>
          </motion.div>

          {/* feature pills — plain text columns, no cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
          >
            {FEATURES.map((f) => (
              <div key={f.title}>
                <Icon d={f.icon} className="h-5 w-5 text-ton-bright" />
                <div className="mt-3 text-sm font-bold">{f.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-white/45">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 grid grid-cols-2 gap-y-6 rounded-2xl border border-white/10 bg-space-900/70 px-6 py-6 backdrop-blur sm:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <Icon d={s.icon} className="h-6 w-6 shrink-0 text-ton-bright" />
                <div>
                  <div className="font-display text-[1.65rem] font-bold leading-tight">
                    <CountUp to={s.to} format={s.format} />
                  </div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right column — THE ORBITER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative"
        >
          <Mascot />
        </motion.div>
      </div>
    </section>
  );
}

/* =================== HOW IT WORKS =================== */
const STEPS = [
  { n: "01", icon: ICONS.create, title: "Create", desc: "Name, ticker, image. 20 seconds." },
  { n: "02", icon: ICONS.rocket, title: "Launch", desc: "Your Jetton is live on TON. Bonding curve starts." },
  { n: "03", icon: ICONS.pump, title: "Pump", desc: "Share the link. Your community does the rest." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-space-950 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.p {...fadeUp} className="text-xs font-bold uppercase tracking-[0.25em] text-ton-bright/80">
          How It Works
        </motion.p>
        <motion.h2 {...fadeUp} className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Three steps. That&apos;s it.
        </motion.h2>
        <motion.p {...fadeUp} className="mt-4 text-white/45">
          No tutorials. No gas guides. Just launch.
        </motion.p>

        <div className="mt-28 grid gap-20 sm:grid-cols-3 sm:gap-10">
          {STEPS.map((s, i) => (
            <motion.div key={s.n} {...stagger(i)} className="relative">
              {/* ghost number behind text */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 left-0 select-none font-display text-[6.5rem] font-bold leading-none text-[rgba(0,152,234,0.15)]"
              >
                {s.n}
              </span>
              <div className="relative pt-8">
                <Icon d={s.icon} className="h-6 w-6 text-ton-bright" />
                <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-white/45">{s.desc}</p>
              </div>
              {/* arrow connector */}
              {i < STEPS.length - 1 && (
                <svg
                  aria-hidden
                  viewBox="0 0 48 16"
                  fill="none"
                  stroke="rgba(0,152,234,0.3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute -right-8 top-10 hidden h-4 w-12 sm:block"
                >
                  <path d="M0 8h42M36 2l8 6-8 6" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
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
