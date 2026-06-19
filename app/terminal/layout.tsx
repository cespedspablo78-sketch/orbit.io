"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";

const TABS = [
  { label: "Pulse", href: "/terminal", soon: false },
  { label: "Trackers", href: "/terminal/wallets", soon: false },
  { label: "Portfolio", href: "/terminal/portfolio", soon: true },
  { label: "Watchlist", href: "/terminal/watchlist", soon: true },
] as const;

function TopBar() {
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search (unless already typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-white/[0.05] bg-[#08090B]/95 px-3 backdrop-blur-xl sm:px-4">
      <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-sm font-bold tracking-tight text-[#FAFAFA]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="VYNX" className="h-6 w-6 scale-110 object-contain" />
        <span className="hidden sm:inline">VYNX</span>
      </Link>

      <nav className="flex items-center gap-0.5">
        {TABS.map((t) => {
          const active = pathname === t.href;
          const cls = `relative rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
            active ? "text-[#FAFAFA]" : "text-[#71717A] hover:text-white/80"
          }`;
          return t.soon ? (
            <span key={t.label} className={`${cls} cursor-default`} title="Coming soon">
              {t.label}
            </span>
          ) : (
            <Link key={t.label} href={t.href} className={cls}>
              {t.label}
              {active && <span className="absolute inset-x-2 -bottom-[7px] h-0.5 rounded-full bg-ton" />}
            </Link>
          );
        })}
      </nav>

      {/* search */}
      <div className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525b]" strokeWidth={2} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by token or contract address"
          className="w-full rounded-lg border border-white/[0.05] bg-[#0F1014] py-1.5 pl-9 pr-10 text-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] outline-none transition placeholder:text-[#52525b] focus:border-ton/50 focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_0_0_3px_rgba(0,152,234,0.12)]"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#52525b]">
          /
        </kbd>
      </div>

      {/* right controls */}
      <div className="ml-auto flex items-center gap-1.5">
        <button className="hidden items-center gap-1.5 rounded-lg border border-white/[0.05] bg-[#0F1014] px-2.5 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/15 sm:flex">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ton text-[8px] font-black text-white">T</span>
          TON
          <ChevronDown className="h-3 w-3 text-[#52525b]" strokeWidth={2.5} />
        </button>
        <button className="rounded-lg bg-ton px-3 py-1.5 text-sm font-bold text-white transition hover:bg-ton-bright active:scale-[0.98]">
          Deposit
        </button>
        <span className="hidden items-center rounded-lg border border-white/[0.05] bg-[#0F1014] px-2.5 py-1.5 font-mono text-xs font-semibold tabular-nums text-white/70 sm:flex">
          0.00 TON
        </span>
        <Link
          href="/terminal/alerts"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition hover:bg-white/[0.05] hover:text-white"
          aria-label="Alerts"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
        </Link>
        <button
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-[#71717A] transition hover:bg-white/[0.05] hover:text-white sm:flex"
          aria-label="Settings"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#08090B] font-geist text-[#FAFAFA] [color-scheme:dark]">
      {/* hairline grid texture + the single ambient glow at the very top */}
      <div className="term-grid pointer-events-none fixed inset-0 -z-10" />
      <div className="term-glow pointer-events-none fixed inset-x-0 top-0 -z-10 h-[36vh]" />
      <TopBar />
      {children}
    </div>
  );
}
