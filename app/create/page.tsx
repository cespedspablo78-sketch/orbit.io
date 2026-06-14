"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, type Sender, type SenderArguments } from "@ton/core";
import { TonClient } from "@ton/ton";
import {
  VYNX_ADDRESSES,
  VynxFactory,
  createCoin,
  predictCoinAddresses,
  tonscan,
  type CoinMeta,
} from "@/lib/vynx-sdk";

/**
 * /create — deploys a real VYNX coin on TON testnet via the SDK + TON Connect.
 */

const TESTNET_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC";

const PlanetMark = ({ className = "h-7 w-7" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
    <defs>
      <radialGradient id="cp-g" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#33BBFF" />
        <stop offset="60%" stopColor="#0098EA" />
        <stop offset="100%" stopColor="#0055AA" />
      </radialGradient>
    </defs>
    <circle cx="20" cy="20" r="10.5" fill="url(#cp-g)" />
    <ellipse cx="13" cy="15" rx="4.5" ry="2.5" fill="#BDEAFF" opacity=".55" transform="rotate(-24 13 15)" />
    <ellipse cx="20" cy="20" rx="18" ry="6.5" stroke="#33BBFF" strokeWidth="1.8" transform="rotate(-24 20 20)" />
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

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-[#0A1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-ton focus:shadow-[0_0_0_3px_rgba(0,152,234,0.15)]";
const labelCls = "mb-2 block text-xs font-bold uppercase tracking-wider text-white/60";

type Status = "idle" | "deploying" | "success" | "error";

export default function CreateCoin() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState<{ url: string; isVideo: boolean } | null>(null);
  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [dragging, setDragging] = useState(false);

  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ address: string; link: string } | null>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) return;
    setMedia({ url: URL.createObjectURL(file), isVideo: file.type.startsWith("video/") });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "deploying") return;

    if (!name.trim() || !ticker.trim()) {
      setError("Name and ticker are required.");
      setStatus("error");
      return;
    }
    // wallet must be connected
    if (!address || !tonConnectUI.account) {
      tonConnectUI.openModal();
      return;
    }

    setStatus("deploying");
    setError("");

    try {
      // TON Connect → @ton/core Sender adapter
      const sender: Sender = {
        address: Address.parse(tonConnectUI.account.address),
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
      };

      const client = new TonClient({
        endpoint: TESTNET_ENDPOINT,
        apiKey: process.env.NEXT_PUBLIC_TONCENTER_KEY,
      });
      const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));

      const meta: CoinMeta = {
        name: name.trim(),
        ticker,
        description: desc.trim(),
        // uploaded files are local previews — on-chain image hosting comes later
        imageUrl: /^https?:\/\//.test(website.trim()) ? website.trim() : "",
      };

      // fires the wallet confirmation modal
      await createCoin(factory, sender, meta);

      // deterministic — the jetton address the factory will deploy for this coin
      let addr = "";
      let link = tonscan(VYNX_ADDRESSES.factory);
      try {
        const { jetton } = await predictCoinAddresses(factory, sender.address!, meta);
        addr = jetton.toString({ testOnly: true, bounceable: true });
        link = tonscan(jetton);
      } catch {
        // get-method/RPC hiccup — still a success, fall back to factory link
      }

      setResult({ address: addr, link });
      setStatus("success");
    } catch (err) {
      console.error("createCoin failed:", err);
      setError(
        err instanceof Error && /reject|cancel|denied/i.test(err.message)
          ? "Transaction cancelled in your wallet."
          : "Something went wrong deploying your token. Please try again.",
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setError("");
    setName("");
    setTicker("");
    setDesc("");
    setMedia(null);
    setWebsite("");
    setTelegram("");
    setTwitter("");
  };

  return (
    <main className="min-h-screen bg-space-950 font-sans">
      {/* testnet banner */}
      <div className="flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-center text-xs font-bold text-black sm:text-sm">
        ⚠️ TESTNET — Tokens have no real value
      </div>

      {/* slim top bar */}
      <header className="flex h-16 items-center justify-between border-b border-white/5 px-6">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
          <LogoMark className="h-9 w-9" />
          <span>
            VYN<span className="text-ton-bright">X</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <TonConnectButton />
          <Link href="/" className="hidden text-sm text-white/40 transition hover:text-white/70 sm:block">
            ← Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr,340px]">
          {/* ===== form / states ===== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {status === "success" ? (
              <div className="rounded-2xl border border-ton/20 bg-ton/5 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ton/15">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#33BBFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h1 className="mt-5 font-display text-2xl font-bold">Token deployed 🛸</h1>
                <p className="mt-2 text-sm text-white/45">
                  ${ticker} is live on TON testnet. The factory is deploying its Jetton and bonding curve now.
                </p>

                {result?.address && (
                  <div className="mt-6">
                    <div className={labelCls}>Token address</div>
                    <code className="block break-all rounded-xl border border-white/[0.08] bg-[#0A1220] px-4 py-3 text-xs text-ton-bright">
                      {result.address}
                    </code>
                  </div>
                )}

                <a
                  href={result?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ton px-6 py-3 text-sm font-bold transition hover:bg-ton-bright"
                >
                  View on Tonscan
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
                <button
                  onClick={reset}
                  className="ml-3 rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-white/70 transition hover:border-ton/40 hover:text-white"
                >
                  Create another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <h1 className="font-display text-3xl font-bold tracking-tight">Create New Coin</h1>
                <p className="mt-2 text-sm text-white/40">Choose carefully — these can&apos;t be changed once live.</p>

                <div className="mt-10 space-y-6">
                  {/* name */}
                  <div>
                    <label htmlFor="name" className={labelCls}>Coin name</label>
                    <input id="name" type="text" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} placeholder="Name your coin" className={inputCls} />
                  </div>

                  {/* ticker */}
                  <div>
                    <label htmlFor="ticker" className={labelCls}>Ticker</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ton-bright">$</span>
                      <input
                        id="ticker"
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8))}
                        placeholder="DOGE"
                        className={`${inputCls} pl-8 font-bold tracking-wide placeholder:font-normal`}
                      />
                    </div>
                  </div>

                  {/* description */}
                  <div>
                    <label htmlFor="desc" className={labelCls}>
                      Description <span className="font-normal normal-case text-white/25">(optional)</span>
                    </label>
                    <textarea id="desc" value={desc} maxLength={280} rows={3} onChange={(e) => setDesc(e.target.value)} placeholder="Write a short description" className={`${inputCls} resize-none`} />
                  </div>

                  {/* media upload */}
                  <div>
                    <label className={labelCls}>Image or video</label>
                    <div
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
                      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition ${
                        dragging ? "border-ton bg-ton/5" : "border-white/[0.12] bg-[#0A1220] hover:border-ton/40"
                      }`}
                    >
                      {media ? (
                        media.isVideo ? (
                          <video src={media.url} className="h-28 w-28 rounded-xl object-cover" muted autoPlay loop />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={media.url} alt="Upload preview" className="h-28 w-28 rounded-xl object-cover" />
                        )
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9 text-white/30" aria-hidden>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                      <p className="mt-4 text-sm font-medium text-white/70">{media ? "Change file" : "Select image or video"}</p>
                      <p className="mt-1 text-xs text-white/30">Drag & drop or click to browse</p>
                      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                    </div>
                  </div>

                  {/* socials */}
                  <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                      <label htmlFor="website" className={labelCls}>Website</label>
                      <input id="website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="telegram" className={labelCls}>Telegram</label>
                      <input id="telegram" type="text" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="t.me/" className={inputCls} />
                    </div>
                    <div>
                      <label htmlFor="twitter" className={labelCls}>X / Twitter</label>
                      <input id="twitter" type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="x.com/" className={inputCls} />
                    </div>
                  </div>

                  {error && status === "error" && (
                    <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-300">
                      {error}
                    </p>
                  )}

                  {/* submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "deploying"}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-ton py-3.5 font-display font-bold text-white transition hover:bg-ton-bright active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "deploying" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Deploying your token...
                        </>
                      ) : !address ? (
                        "Connect Wallet to Create"
                      ) : (
                        "Create Coin"
                      )}
                    </button>
                    <p className="mt-3 text-center text-xs text-white/40">Cost: ~0.5 TON · Powered by VYNX</p>
                  </div>
                </div>
              </form>
            )}
          </motion.div>

          {/* ===== live preview ===== */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:sticky lg:top-12 lg:self-start"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-space-900 p-6">
              <span className="absolute right-4 top-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Preview</span>

              {/* image */}
              <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#0A1220]">
                {media ? (
                  media.isVideo ? (
                    <video src={media.url} className="h-full w-full object-cover" muted autoPlay loop />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={media.url} alt="" className="h-full w-full object-cover" />
                  )
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-8 w-8 text-white/20" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>

              {/* name + ticker */}
              <div className="mt-5 text-center">
                <div className="truncate font-display text-lg font-bold">
                  {name.trim() || <span className="text-white/30">Coin name</span>}
                </div>
                <div className="mt-0.5 text-sm font-bold text-ton-bright">
                  ${ticker || <span className="text-white/30">TICKER</span>}
                </div>
              </div>

              {/* description */}
              <p className="mt-4 min-h-[2.5rem] text-center text-sm leading-relaxed text-white/45">
                {desc.trim() || <span className="text-white/20">Your description will appear here.</span>}
              </p>

              {/* bonding hint */}
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>Bonding curve</span>
                  <span className="font-bold text-ton-bright">0%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-0 rounded-full bg-ton" />
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
