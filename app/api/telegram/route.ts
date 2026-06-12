import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

/**
 * Telegram webhook for the ORBIT.FUN bot.
 *
 * Activate (browser, once per deploy URL change):
 *   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<SITE>/api/telegram
 * Verify:
 *   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
 *
 * Optional hardening: set TELEGRAM_WEBHOOK_SECRET in Vercel and pass
 * &secret_token=<value> to setWebhook — this route then rejects calls
 * without the matching header.
 */

export const runtime = "nodejs";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbit-io-amber.vercel.app";
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// no polling — serverless: we only send replies to webhook updates
const bot = TOKEN ? new TelegramBot(TOKEN) : null;

const KEYBOARD = {
  inline_keyboard: [
    [{ text: "🚀 Join Waitlist", url: `${SITE}/launch` }],
    [
      { text: "🌐 Website", url: SITE },
      { text: "📄 Docs", url: `${SITE}/docs` },
    ],
  ],
};

const MESSAGES: Record<string, string> = {
  "/start": [
    "<b>Welcome to ORBIT.FUN</b> 🪐",
    "",
    "Launch memecoins on TON in seconds. No code, no gas math, no rug levers.",
    "",
    "The launchpad is coming — be first in orbit. Early users get priority access.",
  ].join("\n"),
  "/waitlist": [
    "<b>Be first in orbit.</b>",
    "",
    "Early users get priority access when the launchpad goes live:",
    `${SITE}/launch`,
  ].join("\n"),
  "/roadmap": [
    "<b>ORBIT.FUN — Roadmap</b>",
    "",
    "🔵 <b>Phase 1 — Now:</b> Landing + Waitlist",
    "⚪ <b>Phase 2 — Q3 2026:</b> Beta (testnet contracts, token creation, bonding curve)",
    "⚪ <b>Phase 3 — Q4 2026:</b> Launch (mainnet, STON.fi integration, leaderboards)",
    "⚪ <b>Phase 4 — 2027:</b> Telegram Mini App (launch from chat, in-chat trading)",
    "",
    "Built in public. Every step, every ship.",
  ].join("\n"),
  "/docs": [
    "<b>How Orbit works</b> — the short version:",
    "",
    "1️⃣ Create — name, ticker, image. 20 seconds.",
    "2️⃣ Launch — your Jetton goes live on a bonding curve.",
    "3️⃣ Pump — when the curve fills, liquidity graduates to a DEX and locks.",
    "",
    `Full docs: ${SITE}/docs`,
  ].join("\n"),
  "/help": [
    "<b>Commands</b>",
    "",
    "/start — what is ORBIT.FUN",
    "/waitlist — join the waitlist",
    "/roadmap — where we are, where we're going",
    "/docs — how it works",
    "/help — this menu",
  ].join("\n"),
};

export async function POST(req: NextRequest) {
  // Telegram expects 200 quickly; never let an error cause retry storms
  try {
    if (!bot) {
      console.error("TELEGRAM_BOT_TOKEN is not set");
      return NextResponse.json({ ok: true });
    }
    if (SECRET && req.headers.get("x-telegram-bot-api-secret-token") !== SECRET) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const update = await req.json();
    const msg = update.message ?? update.edited_message;
    const chatId: number | undefined = msg?.chat?.id;
    const text: string = msg?.text ?? "";
    if (!chatId || !text) return NextResponse.json({ ok: true });

    // "/start@OrbitFunBot extra" → "/start"
    const cmd = text.trim().split(/[\s@]/)[0].toLowerCase();
    const reply = MESSAGES[cmd];

    if (reply) {
      await bot.sendMessage(chatId, reply, {
        parse_mode: "HTML",
        reply_markup: KEYBOARD,
        disable_web_page_preview: true,
      });
    } else if (cmd.startsWith("/")) {
      await bot.sendMessage(chatId, "Unknown command. Try /help 🛸", {
        reply_markup: KEYBOARD,
      });
    }
    // non-command chatter in groups is ignored on purpose

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("telegram webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}

/** Health check — open <SITE>/api/telegram in a browser. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "orbit.fun telegram webhook",
    configured: Boolean(TOKEN),
  });
}
