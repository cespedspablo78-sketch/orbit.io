"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

const TABS = [
  { label: "Pulse", href: "/terminal", soon: false },
  { label: "Trackers", href: "/terminal/wallets", soon: false },
  { label: "Portfolio", href: "/terminal/portfolio", soon: true },
  { label: "Watchlist", href: "/terminal/watchlist", soon: true },
] as const;

function TopBar() {
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

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
    <header className="flex h-12 items-center gap-4 border-b border-white/[0.06] px-4">
      {/* logo */}
      <Link href="/" className="flex shrink-0 items-center gap-2 text-[13px] font-semibold tracking-tight text-white/90">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="VYNX" className="h-6 w-6 scale-110 object-contain" />
        <span className="hidden sm:inline">VYNX</span>
      </Link>

      {/* tabs — active = blue underline only */}
      <nav className="flex items-center gap-1">
        {TABS.map((t) => {
          const active = pathname === t.href;
          const cls = `relative px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
            active ? "text-white/90" : "text-white/40 hover:text-white/70"
          }`;
          return t.soon ? (
            <span key={t.label} className={`${cls} cursor-default`} title="Coming soon">
              {t.label}
            </span>
          ) : (
            <Link key={t.label} href={t.href} className={cls}>
              {t.label}
              {active && <span className="absolute inset-x-2.5 -bottom-[7px] h-0.5 bg-ton" />}
            </Link>
          );
        })}
      </nav>

      {/* search — no fill, hairline only */}
      <div className="relative ml-2 hidden max-w-sm flex-1 lg:block">
        <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" strokeWidth={2} />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search token or address"
          className="w-full border-b border-white/[0.08] bg-transparent py-1.5 pl-6 pr-8 text-[13px] outline-none transition-colors placeholder:text-white/25 focus:border-white/25"
        />
        <kbd className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-white/25">/</kbd>
      </div>

      {/* right: balance + connect */}
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden font-mono text-[12px] tabular-nums text-white/55 sm:inline">0.00 TON</span>
        <button className="bg-ton px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1AA5EE] active:bg-[#0086D2]" style={{ borderRadius: 4 }}>
          Connect
        </button>
      </div>
    </header>
  );
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#04070D] font-geist text-white/90 [color-scheme:dark]">
      <TopBar />
      {children}
    </div>
  );
}
