"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, fromNano, toNano, type Sender, type SenderArguments } from "@ton/core";
import { getTonClient, withTonClient } from "@/lib/tonClient";
import {
  VYNX_ADDRESSES,
  VynxBondingCurve,
  VynxFactory,
  VynxJetton,
  balanceOf,
  buy,
  estimateTokensForBudget,
  getMetadata,
  getState,
  sell,
  tonscan,
  ONE_TOKEN,
  type CurveState,
  type JettonMetadata,
} from "@/lib/vynx-sdk";

const SITE = "https://orbit-io-amber.vercel.app";

/* ---------- small helpers ---------- */
const short = (a: string) => (a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);
const fmtTon = (nano: bigint, dp = 4) => {
  const n = Number(fromNano(nano));
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  return n.toLocaleString("en-US", { maximumFractionDigits: dp });
};

const PlanetMark = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
    <defs>
      <radialGradient id="tp-g" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#33BBFF" />
        <stop offset="60%" stopColor="#0098EA" />
        <stop offset="100%" stopColor="#0055AA" />
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="10.5" fill="url(#tp-g)" />
    <ellipse cx="13" cy="15" rx="4.5" ry="2.5" fill="#BDEAFF" opacity=".55" transform="rotate(-24 13 15)" />
    <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#33BBFF" strokeWidth="1.8" transform="rotate(-24 20 20)" />
  </svg>
);

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#0A1220] px-4 py-3 text-lg font-bold text-white outline-none transition placeholder:font-normal placeholder:text-white/25 focus:border-ton focus:shadow-[0_0_0_3px_rgba(0,152,234,0.15)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none";

/** Representative bonding-curve shape for the chart (mock until we index trades). */
function curvePoints(progress: number) {
  const pts: { x: number; price: number; fill?: number }[] = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 100;
    const price = 1 + 0.05 * Math.pow(x, 1.55); // accelerating curve
    pts.push({ x: Math.round(x), price: Number(price.toFixed(2)), fill: x <= progress ? Number(price.toFixed(2)) : 0 });
  }
  return pts;
}

export default function TokenPage({ params }: { params: { address: string } }) {
  const address = params.address;

  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonAddress();

  const [meta, setMeta] = useState<JettonMetadata | null>(null);
  const [state, setState] = useState<CurveState | null>(null);
  const [curveAddr, setCurveAddr] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [myBalance, setMyBalance] = useState<bigint | null>(null);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [txMsg, setTxMsg] = useState("");

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const jettonAddr = Address.parse(address);
      const { m, s, cAddr } = await withTonClient(async (client) => {
        const jetton = client.open(VynxJetton.fromAddress(jettonAddr));
        const m = await getMetadata(jetton);
        const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));
        const cAddr = await factory.getCurveAddress(jettonAddr);
        const curve = client.open(VynxBondingCurve.fromAddress(cAddr));
        const s = await getState(curve);
        return { m, s, cAddr };
      });

      setMeta(m);
      setState(s);
      setCurveAddr(cAddr.toString({ testOnly: true, bounceable: true }));
    } catch (err) {
      console.error("token load failed:", err);
      setLoadError("Couldn't load this token. It may still be deploying, or the address is invalid.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    load();
  }, [load]);

  // user's token balance on the curve (for the sell tab)
  useEffect(() => {
    (async () => {
      if (!wallet || !curveAddr) return setMyBalance(null);
      try {
        const client = await getTonClient();
        const curve = client.open(VynxBondingCurve.fromAddress(Address.parse(curveAddr)));
        setMyBalance(await balanceOf(curve, Address.parse(wallet)));
      } catch {
        setMyBalance(null);
      }
    })();
  }, [wallet, curveAddr, txStatus]);

  const makeSender = (): Sender => ({
    address: Address.parse(tonConnectUI.account!.address),
    async send(args: SenderArguments) {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body ? args.body.toBoc().toString("base64") : undefined,
          },
        ],
      });
    },
  });

  const onTrade = async () => {
    if (!wallet || !tonConnectUI.account) {
      tonConnectUI.openModal();
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0 || !curveAddr) {
      setTxStatus("error");
      setTxMsg("Enter an amount.");
      return;
    }
    setTxStatus("pending");
    setTxMsg("");
    try {
      const client = await getTonClient();
      const curve = client.open(VynxBondingCurve.fromAddress(Address.parse(curveAddr)));
      const sender = makeSender();
      if (tab === "buy") {
        await buy(curve, sender, toNano(amount));
      } else {
        await sell(curve, sender, BigInt(Math.floor(amt)));
      }
      setTxStatus("done");
      setTxMsg(tab === "buy" ? "Buy sent! Updating…" : "Sell sent! Updating…");
      setAmount("");
      setTimeout(load, 4000); // let the tx settle, then refresh state
    } catch (err) {
      console.error("trade failed:", err);
      setTxStatus("error");
      setTxMsg(
        err instanceof Error && /reject|cancel|denied/i.test(err.message)
          ? "Transaction cancelled in your wallet."
          : "Transaction failed. Please try again.",
      );
    }
  };

  /* derived display values */
  const progress = state ? Math.min(100, state.progress) : 0;
  const remainingTon = state ? state.graduationThreshold - state.reserve : 0n;
  const mcNano = state ? state.price * state.soldTokens : 0n;
  const chart = useMemo(() => curvePoints(progress), [progress]);

  const buyTokens =
    tab === "buy" && state && Number(amount) > 0
      ? estimateTokensForBudget(state.sold, toNano(amount || "0")) / ONE_TOKEN
      : 0n;
  const sellTon =
    tab === "sell" && state && Number(amount) > 0 ? BigInt(Math.floor(Number(amount))) * state.price : 0n;

  const shareUrl = `${SITE}/token/${address}`;
  const shareText = meta ? `Check out $${meta.ticker} on VYNX` : "Check out this token on VYNX";

  return (
    <main className="min-h-screen bg-space-950 font-sans">
      {/* testnet banner */}
      <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-center text-xs font-bold text-black sm:text-sm">
        ⚠️ TESTNET — Tokens have no real value
      </div>

      {/* top bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/5 px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <PlanetMark className="h-9 w-9" />
          <span>
            VYN<span className="text-ton-bright">X</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <TonConnectButton />
          <Link href="/create" className="hidden rounded-xl bg-ton px-4 py-2 text-sm font-bold transition hover:bg-ton-bright sm:block">
            + Create
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
            <div className="shimmer h-72 rounded-2xl" />
            <div className="shimmer h-96 rounded-2xl" />
          </div>
        ) : loadError ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <h1 className="font-display text-2xl font-bold">Token unavailable</h1>
            <p className="mt-3 text-sm text-white/45">{loadError}</p>
            <a href={tonscan(address)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-xl bg-ton px-6 py-3 text-sm font-bold transition hover:bg-ton-bright">
              View on Tonscan
            </a>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-8 lg:grid-cols-[1fr,400px]"
          >
            {/* ===== LEFT ===== */}
            <div>
              <div className="flex items-start gap-5">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#0A1220]">
                  {meta?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={meta.imageUrl} alt={meta.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl">🪙</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-3xl font-bold">{meta?.name || "Unnamed"}</h1>
                  <div className="mt-1 text-lg font-bold text-ton-bright">${meta?.ticker}</div>
                  {state?.graduated && (
                    <span className="mt-2 inline-block rounded-full bg-ton/15 px-3 py-1 text-xs font-bold text-ton-bright">
                      🎓 Graduated
                    </span>
                  )}
                </div>
              </div>

              {meta?.description && (
                <p className="mt-6 leading-relaxed text-white/55">{meta.description}</p>
              )}

              {/* meta rows */}
              <div className="mt-6 space-y-3 border-t border-white/5 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Token address</span>
                  <a href={tonscan(address)} target="_blank" rel="noopener noreferrer" className="font-medium text-ton-bright hover:underline">
                    {short(address)}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Bonding curve</span>
                  <span className="font-medium text-white/70">{short(curveAddr)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Network</span>
                  <span className="font-medium text-white/70">TON testnet</span>
                </div>
              </div>

              {/* links */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={tonscan(address)} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-ton/40 hover:text-white">
                  Tonscan ↗
                </a>
                <a href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-ton/40 hover:text-white">
                  Share on X
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-ton/40 hover:text-white">
                  Share on Telegram
                </a>
              </div>
            </div>

            {/* ===== RIGHT ===== */}
            <div className="space-y-6">
              {/* chart + stats */}
              <div className="rounded-2xl border border-white/[0.08] bg-space-900 p-5">
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0098EA" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0098EA" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="x" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{ background: "#060A12", border: "1px solid rgba(0,152,234,0.25)", borderRadius: 12, fontSize: 12 }}
                        labelFormatter={(l) => `${l}% sold`}
                        formatter={(v) => [`${v}`, "rel. price"]}
                      />
                      <Area type="monotone" dataKey="price" stroke="#33BBFF" strokeWidth={2} fill="url(#curveFill)" dot={false} />
                      <ReferenceLine x={Math.round(progress)} stroke="#33BBFF" strokeDasharray="3 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="text-xs text-white/40">Current price</div>
                    <div className="mt-0.5 font-display font-bold">{state ? fmtTon(state.price, 9) : "—"} TON</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40">Market cap</div>
                    <div className="mt-0.5 font-display font-bold">{fmtTon(mcNano)} TON</div>
                  </div>
                </div>

                {/* bonding progress */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-white/40">Bonding curve</span>
                    <span className="font-bold text-ton-bright">
                      {state?.graduated ? "Graduated 🎓" : `${fmtTon(remainingTon, 2)} TON to graduation 🎓`}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full bg-ton"
                    />
                  </div>
                  <div className="mt-1.5 text-right text-xs text-white/40">{progress.toFixed(1)}%</div>
                </div>
              </div>

              {/* trade card */}
              <div className="rounded-2xl border border-white/[0.08] bg-space-900 p-5">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-space-950 p-1">
                  {(["buy", "sell"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setAmount(""); setTxStatus("idle"); }}
                      className={`rounded-lg py-2.5 text-sm font-bold capitalize transition ${
                        tab === t ? (t === "buy" ? "bg-ton text-white" : "bg-white/10 text-white") : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* amount */}
                <div className="relative mt-5">
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className={`${inputCls} pr-20`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-white/40">
                    {tab === "buy" ? "TON" : `$${meta?.ticker}`}
                  </span>
                </div>

                {/* quick amounts */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {(tab === "buy" ? ["0.5", "1", "5", "10"] : ["25%", "50%", "75%", "Max"]).map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        if (tab === "buy") setAmount(q);
                        else {
                          const bal = myBalance ? Number(myBalance / ONE_TOKEN) : 0;
                          const pct = q === "Max" ? 1 : Number(q.replace("%", "")) / 100;
                          setAmount(String(Math.floor(bal * pct)));
                        }
                      }}
                      className="rounded-lg border border-white/5 bg-space-950 py-2 text-xs font-bold text-white/40 transition hover:border-ton/30 hover:text-white/70"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {tab === "sell" && wallet && (
                  <div className="mt-3 text-right text-xs text-white/40">
                    Balance: {myBalance !== null ? (myBalance / ONE_TOKEN).toString() : "…"} ${meta?.ticker}
                  </div>
                )}

                {/* action */}
                <button
                  onClick={onTrade}
                  disabled={txStatus === "pending"}
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${
                    tab === "buy" ? "bg-ton text-white hover:bg-ton-bright" : "border border-white/15 text-white hover:border-ton/40"
                  }`}
                >
                  {txStatus === "pending" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Confirming…
                    </>
                  ) : !wallet ? (
                    "Connect Wallet"
                  ) : tab === "buy" ? (
                    `Buy $${meta?.ticker}`
                  ) : (
                    `Sell $${meta?.ticker}`
                  )}
                </button>

                {/* estimate */}
                <p className="mt-3 text-center text-xs text-white/40">
                  {tab === "buy"
                    ? `You receive ~${buyTokens.toLocaleString("en-US")} ${meta?.ticker || "tokens"}`
                    : `You receive ~${fmtTon(sellTon)} TON`}
                </p>

                {txMsg && (
                  <p className={`mt-3 text-center text-xs font-medium ${txStatus === "error" ? "text-amber-300" : "text-ton-bright"}`}>
                    {txMsg}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
