import Link from "next/link";

export const metadata = { title: "Docs — ORBIT.FUN" };

const SECTIONS = [
  {
    title: "Getting started",
    body: "Connect a TON wallet, pick a name and ticker, upload an image. Your Jetton deploys in seconds — no code, no liquidity setup, no gas math.",
  },
  {
    title: "Bonding curve",
    body: "Every coin starts on a bonding curve: price is set by the curve from the very first buy. No presale, no team allocation, no rug levers.",
  },
  {
    title: "Graduation",
    body: "When the curve fills, liquidity automatically migrates to a DEX and is locked. The 🎓 badge means a coin completed its curve.",
  },
  {
    title: "Fees",
    body: "Launching costs ~0.3 TON. Trades pay a 1% protocol fee. That's the whole fee schedule.",
  },
];

export default function Docs() {
  return (
    <main className="min-h-screen bg-space-950 px-6 py-24 font-sans">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-white/40 transition hover:text-white/70">
          ← Back to orbit.fun
        </Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-ton-bright/80">Docs</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          How Orbit works.
        </h1>
        <p className="mt-4 text-white/45">Short version. Full docs ship with the beta.</p>

        <div className="mt-16 space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl font-bold">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-white/55">{s.body}</p>
            </section>
          ))}
        </div>

        <Link
          href="/launch"
          className="mt-16 inline-flex items-center gap-2 rounded-xl bg-ton px-6 py-3 text-sm font-bold transition hover:bg-ton-bright"
        >
          Join the waitlist →
        </Link>
      </div>
    </main>
  );
}
