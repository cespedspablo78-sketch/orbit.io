"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Pre-launch waitlist. Emails persist to localStorage for now —
 * swap for a real endpoint (Resend / Supabase / sheet) before promoting.
 */

const BASE_COUNT = 1247;
const STORE_KEY = "orbit-waitlist";

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

function getStored(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function Launch() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(BASE_COUNT + getStored().length);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError("Enter a valid email.");
      return;
    }
    setError("");
    const list = getStored();
    if (!list.includes(v)) list.push(v);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
    setCount(BASE_COUNT + list.length);
    setJoined(true);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-space-950 px-6 py-20 font-sans">
      {/* atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[42%] h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ton/10 blur-[120px]" />
        <div className="grid-bg absolute inset-0 opacity-50" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        <Link
          href="/"
          className="text-sm text-white/40 transition hover:text-white/70"
        >
          ← VYNX
        </Link>

        {/* orbit emblem — planet + rotating rings */}
        <div className="relative mx-auto mt-12 h-28 w-28">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 rounded-full border border-ton/30" />
            <span className="absolute left-1/2 top-[-3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ton-bright shadow-[0_0_10px_#33BBFF]" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3"
          >
            <div className="absolute inset-0 rounded-full border border-ton/20" />
            <span className="absolute bottom-[-2px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ton/70" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg viewBox="0 0 40 40" fill="none" className="h-12 w-12 drop-shadow-[0_0_20px_rgba(0,152,234,0.6)]" aria-hidden>
              <defs>
                <radialGradient id="lp-g" cx="35%" cy="30%" r="80%">
                  <stop offset="0%" stopColor="#33BBFF" />
                  <stop offset="60%" stopColor="#0098EA" />
                  <stop offset="100%" stopColor="#0055AA" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="11" fill="url(#lp-g)" />
              <ellipse cx="13" cy="15" rx="4.5" ry="2.5" fill="#BDEAFF" opacity=".55" transform="rotate(-24 13 15)" />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-10 font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          VYNX
          <br />
          is <span className="text-glow text-ton-bright">coming.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mx-auto mt-5 max-w-sm text-white/45"
        >
          Be first in orbit. Early users get priority access.
        </motion.p>

        {/* waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          {joined ? (
            <div className="rounded-2xl border border-ton/20 bg-ton/5 px-6 py-8">
              <p className="font-display text-lg font-bold">You&apos;re in orbit. 🛸</p>
              <p className="mt-2 text-sm text-white/45">We&apos;ll ping you at launch.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@vynx.fun"
                aria-label="Email"
                className="flex-1 rounded-xl border border-white/10 bg-space-900 px-5 py-3.5 text-sm outline-none transition placeholder:text-white/25 focus:border-ton/40"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl bg-ton px-7 py-3.5 font-display text-sm font-bold shadow-glow-sm transition hover:bg-ton-bright hover:shadow-glow-md"
              >
                Join Waitlist
              </motion.button>
            </form>
          )}
          {error && !joined && <p className="mt-3 text-sm font-medium text-ton-bright">{error}</p>}

          {/* counter */}
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-white/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ton-bright" />
            {count !== null ? `${count.toLocaleString("en-US")} already waiting` : "…"}
          </p>
        </motion.div>

        {/* socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Or follow the mission</p>
          <div className="mt-4 flex justify-center gap-3">
            <a
              href="#"
              aria-label="Telegram"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-space-900 text-white/70 transition hover:border-ton/40 hover:text-ton-bright"
            >
              <TelegramIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href="#"
              aria-label="X"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-space-900 text-white/70 transition hover:border-ton/40 hover:text-ton-bright"
            >
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
