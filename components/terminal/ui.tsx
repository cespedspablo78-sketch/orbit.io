"use client";

/* warm-dark terminal palette */
export const UP = "#2ebd85";
export const DOWN = "#f6465d";

/* ---------- line icons ---------- */
export const TIcon = ({ d, className = "h-[18px] w-[18px]" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d={d} />
  </svg>
);

export const ICONS = {
  dashboard: "M3 10.5 12 3l9 7.5M5 9v12h14V9",
  watchlist: "M11 3.5 13.6 8.8l5.9.9-4.3 4.1 1 5.8L11 17.9 5.8 19.6l1-5.8L2.5 9.7l5.9-.9L11 3.5z",
  wallets: "M20 7H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14v4M2 5v14a2 2 0 0 0 2 2h18V7M16.5 14h.01",
  alerts: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  portfolio: "M3 3v18h18M7 14l4-4 3 3 5-6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  plus: "M12 5v14M5 12h14",
  back: "M19 12H5M11 18l-6-6 6-6",
  bolt: "M13 2 3 14h8l-1 8 11-13h-8l0-7z",
  ext: "M7 17 17 7M8 7h9v9",
  chevron: "M9 6l6 6-6 6",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  star: "M11 3.5 13.6 8.8l5.9.9-4.3 4.1 1 5.8L11 17.9 5.8 19.6l1-5.8L2.5 9.7l5.9-.9L11 3.5z",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
} as const;

/* ---------- token avatar (gradient by hue + emoji) ---------- */
export function CoinAvatar({
  token,
  className = "h-8 w-8 text-base",
}: {
  token: { emoji: string; hue: number };
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{ background: `radial-gradient(circle at 35% 30%, hsl(${token.hue} 55% 24%), hsl(${token.hue} 60% 12%) 78%)` }}
    >
      {token.emoji}
    </span>
  );
}

/* ---------- colored % change ---------- */
export function Change({ value, className = "" }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span className={`tabular-nums font-medium ${className}`} style={{ color: up ? UP : DOWN }}>
      {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

/* ---------- "coming soon" inline tag ---------- */
export function Soon() {
  return (
    <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white/40">
      Soon
    </span>
  );
}
