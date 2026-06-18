"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ICONS, Soon, TIcon } from "@/components/terminal/ui";

const NAV = [
  { label: "Dashboard", href: "/terminal", icon: ICONS.dashboard, soon: false },
  { label: "Watchlist", href: "/terminal/watchlist", icon: ICONS.watchlist, soon: true },
  { label: "Wallets", href: "/terminal/wallets", icon: ICONS.wallets, soon: false },
  { label: "Alerts", href: "/terminal/alerts", icon: ICONS.alerts, soon: false },
  { label: "Portfolio", href: "/terminal/portfolio", icon: ICONS.portfolio, soon: true },
] as const;

function VynxLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="VYNX" className="h-7 w-7 scale-110 object-contain" />
      <span>VYNX</span>
    </Link>
  );
}

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[212px] flex-col border-r border-white/[0.06] bg-[#0C0C0E] lg:flex">
      <div className="flex h-14 items-center border-b border-white/[0.06] px-5">
        <VynxLogo />
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const cls = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            active ? "bg-white/[0.06] text-white" : "text-white/45 hover:bg-white/[0.03] hover:text-white/80"
          }`;
          const inner = (
            <>
              <span className={active ? "text-ton-bright" : ""}>
                <TIcon d={item.icon} />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.soon && <Soon />}
            </>
          );
          return item.soon ? (
            <span key={item.label} className={`${cls} cursor-default`}>
              {inner}
            </span>
          ) : (
            <Link key={item.label} href={item.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-ton px-3 py-2.5 text-sm font-bold transition hover:bg-ton-bright"
        >
          <TIcon d={ICONS.plus} className="h-4 w-4" />
          Create Coin
        </Link>
        <p className="mt-3 text-center text-[10px] text-white/25">UI preview · mock data</p>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-[#0A0A0B]/90 px-4 backdrop-blur-xl">
      <Link href="/" className="lg:hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="VYNX" className="h-7 w-7 scale-110 object-contain" />
      </Link>
      <div className="relative max-w-sm flex-1">
        <TIcon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search tokens, wallets…"
          className="w-full rounded-lg border border-white/[0.06] bg-[#111113] py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-white/25 focus:border-ton/40"
        />
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <span className="hidden items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#111113] px-3 py-2 text-xs text-white/50 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Testnet
        </span>
        <button className="rounded-lg bg-ton px-4 py-2 text-sm font-bold transition hover:bg-ton-bright">
          Connect
        </button>
      </div>
    </header>
  );
}

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] font-sans text-white [color-scheme:dark]">
      <Sidebar />
      <div className="lg:pl-[212px]">
        <TopBar />
        {children}
      </div>
    </div>
  );
}
