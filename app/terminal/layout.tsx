"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICONS, TIcon } from "@/components/terminal/ui";

const TABS = [
  { label: "Pulse", href: "/terminal", soon: false },
  { label: "Trackers", href: "/terminal/wallets", soon: false },
  { label: "Portfolio", href: "/terminal/portfolio", soon: true },
  { label: "Watchlist", href: "/terminal/watchlist", soon: true },
] as const;

function TopBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-white/[0.06] bg-[#0A0A0B] px-3 sm:px-4">
      {/* logo */}
      <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-sm font-bold tracking-tight">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="VYNX" className="h-6 w-6 scale-110 object-contain" />
        <span className="hidden sm:inline">VYNX</span>
      </Link>

      {/* tabs */}
      <nav className="flex items-center gap-0.5">
        {TABS.map((t) => {
          const active = pathname === t.href;
          const cls = `relative rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            active ? "text-white" : "text-white/40 hover:text-white/70"
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
        <TIcon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search by token or CA…"
          className="w-full rounded-lg border border-white/[0.06] bg-[#111113] py-1.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-white/25 focus:border-ton/40"
        />
      </div>

      {/* right controls */}
      <div className="ml-auto flex items-center gap-1.5">
        <button className="hidden items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#111113] px-2.5 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/15 sm:flex">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-ton text-[8px] font-black text-white">T</span>
          TON
          <TIcon d={ICONS.chevron} className="h-3 w-3 rotate-90 text-white/30" />
        </button>
        <button className="rounded-lg bg-ton px-3 py-1.5 text-sm font-bold transition hover:bg-ton-bright">Deposit</button>
        <span className="hidden items-center rounded-lg border border-white/[0.06] bg-[#111113] px-2.5 py-1.5 text-xs font-semibold tabular-nums text-white/70 sm:flex">
          0.00 TON
        </span>
        <Link href="/terminal/alerts" className="flex h-8 w-8 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.05] hover:text-white" aria-label="Alerts">
          <TIcon d={ICONS.bell} className="h-[18px] w-[18px]" />
        </Link>
        <button className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/[0.05] hover:text-white sm:flex" aria-label="Settings">
          <TIcon d={ICONS.settings} className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  );
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] font-sans text-white [color-scheme:dark]">
      <TopBar />
      {children}
    </div>
  );
}
