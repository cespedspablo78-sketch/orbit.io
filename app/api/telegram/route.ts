import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "node-telegram-bot-api";

/**
 * Telegram webhook for the VYNX bot.
 *
 * Activate (browser, once per deploy URL change):
 *   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<SITE>/api/telegram
 * Verify:
 *   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
 *
 * Auto-welcome on group join requires the bot to be a member of the group.
 */

export const runtime = "nodejs";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbit-io-amber.vercel.app";
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const TELEGRAM_GROUP = "https://t.me/+iwn4e-sDm31jMzQx";
const X_URL = "https://x.com/vynxjz";

// no polling — serverless: we only send replies to webhook updates
const bot = TOKEN ? new TelegramBot(TOKEN) : null;

const KEYBOARD = {
  inline_keyboard: [
    [
      { text: "📢 Telegram", url: TELEGRAM_GROUP },
      { text: "🐦 X", url: X_URL },
    ],
    [{ text: "🌐 Website", url: SITE }],
  ],
};

const MESSAGES: Record<string, string> = {
  "/start": [
    "🛸 <b>Welcome to VYNX</b>",
    "",
    "The easiest memecoin launchpad on TON is coming.",
    "",
    "⚡ Create tokens in 30 seconds",
    "💸 Lowest fees on TON",
    "🚀 Built for Telegram",
    "",
    "Join our community:",
    `📢 Telegram: ${TELEGRAM_GROUP}`,
    `🐦 X: ${X_URL}`,
    "",
    "Every token takes orbit. 🌑",
  ].join("\n"),
  "/website": [
    "<b>VYNX</b> 🌐",
    "",
    SITE,
  ].join("\n"),
  "/roadmap": [
    "<b>VYNX — Roadmap</b>",
    "",
    "🔵 <b>Phase 1 — Now:</b> Landing + Community",
    "⚪ <b>Phase 2 — Q3 2026:</b> Beta (testnet contracts, token creation, bonding curve)",
    "⚪ <b>Phase 3 — Q4 2026:</b> Launch (mainnet, STON.fi integration, leaderboards)",
    "⚪ <b>Phase 4 — 2027:</b> Telegram Mini App (launch from chat, in-chat trading)",
    "",
    "Built in public. Every step, every ship.",
  ].join("\n"),
  "/docs": [
    "<b>How VYNX works</b> — the short version:",
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
    "/start — what is VYNX",
    "/website — open the site",
    "/roadmap — where we are, where we're going",
    "/docs — how it works",
    "/help — this menu",
  ].join("\n"),
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const welcomeJoin = (handle: string): string =>
  [
    `🛸 <b>Welcome to VYNX, ${handle}!</b>`,
    "",
    "The easiest memecoin launchpad on TON is coming.",
    "",
    "Every token takes orbit. 🌑",
  ].join("\n");

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
    if (!chatId) return NextResponse.json({ ok: true });

    // someone joined the group → auto-welcome (short, no links)
    const newMembers = msg?.new_chat_members as Array<{ username?: string; first_name?: string; is_bot?: boolean }> | undefined;
    if (Array.isArray(newMembers) && newMembers.length) {
      for (const m of newMembers) {
        if (m.is_bot) continue;
        const handle = m.username ? `@${m.username}` : escapeHtml(m.first_name ?? "degen");
        await bot.sendMessage(chatId, welcomeJoin(handle), {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }
      return NextResponse.json({ ok: true });
    }

    const text: string = msg?.text ?? "";
    if (!text) return NextResponse.json({ ok: true });

    // "/start@VynxBot extra" → "/start"
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
    service: "vynx telegram webhook",
    configured: Boolean(TOKEN),
  });
}
