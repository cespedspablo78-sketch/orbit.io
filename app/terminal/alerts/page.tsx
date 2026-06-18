"use client";

import { useState } from "react";
import { ALERTS, type Alert } from "@/lib/terminalMock";
import { ICONS, TIcon } from "@/components/terminal/ui";

const TYPE_META: Record<Alert["type"], { d: string; tint: string }> = {
  Price: { d: "M3 17l6-6 4 4 8-8M16 7h5v5", tint: "#0098EA" },
  Volume: { d: "M3 21h18M7 21v-7M12 21V9M17 21v-4", tint: "#2ebd85" },
  "Wallet Activity": { d: "M20 7H4a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14v4M2 5v14a2 2 0 0 0 2 2h18V7M16.5 14h.01", tint: "#a78bfa" },
  "New Listing": { d: "M12 5v14M5 12h14", tint: "#f59e0b" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const toggle = (id: number) => setAlerts((a) => a.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold">Alerts</h1>
          <p className="mt-1 text-sm text-white/40">
            {alerts.filter((a) => a.active).length} active · mock data
          </p>
        </div>
        <button className="flex items-center gap-2 self-start rounded-lg bg-ton px-4 py-2.5 text-sm font-bold transition hover:bg-ton-bright">
          <TIcon d={ICONS.plus} className="h-4 w-4" /> Create Alert
        </button>
      </div>

      {/* type chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(TYPE_META) as Alert["type"][]).map((t) => (
          <span key={t} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-[#111113] px-3 py-1.5 text-xs text-white/55">
            <TIcon d={TYPE_META[t].d} className="h-3.5 w-3.5" />
            {t}
          </span>
        ))}
      </div>

      {/* list */}
      <div className="mt-5 space-y-2">
        {alerts.map((a) => {
          const m = TYPE_META[a.type];
          return (
            <div key={a.id} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#0E0E10] px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${m.tint}1a`, color: m.tint }}>
                <TIcon d={m.d} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.target}</span>
                  <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/40">{a.type}</span>
                </div>
                <div className="truncate text-sm text-white/45">{a.condition}</div>
              </div>
              {/* toggle */}
              <button
                onClick={() => toggle(a.id)}
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${a.active ? "bg-ton" : "bg-white/10"}`}
                aria-label="toggle alert"
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${a.active ? "left-[18px]" : "left-0.5"}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
