"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * THE ORBITER — DOM overlay layered OVER the 3D hero canvas.
 * Orbit rings, platform and TON coins are rendered in 3D (Scene3D.tsx);
 * this component contributes the character itself plus the blue energy
 * flames that hug it.
 *
 * The character is /public/mascot.png (AI render, transparent bg).
 * Until that file exists, a hooded-silhouette fallback renders so the
 * layout never breaks. Drop the PNG in and it takes over automatically.
 */
export default function Mascot() {
  const [hasRender, setHasRender] = useState(true);

  return (
    <div className="relative mx-auto h-[600px] w-full max-w-[640px] sm:h-[720px]">
      {/* energy glow behind the character */}
      <motion.div
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[52%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ton/20 blur-[80px]"
      />

      {/* blue fire rising around the character */}
      <Flames />

      {/* the Orbiter — float + breathing */}
      <motion.div
        animate={{ y: [0, -14, 0], scale: [1, 1.013, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: "-50%" }}
        className="absolute bottom-[2%] left-1/2 z-10 w-[400px] sm:w-[480px]"
      >
        {hasRender ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/mascot.png"
            alt="The Orbiter"
            onError={() => setHasRender(false)}
            className="w-full"
            style={{
              filter:
                "drop-shadow(0 0 60px rgba(0,152,234,0.5)) drop-shadow(0 0 120px rgba(0,100,200,0.3))",
              // fades the edges so even a baked dark background melts into the scene
              WebkitMaskImage:
                "radial-gradient(ellipse 52% 52% at 50% 48%, black 62%, transparent 88%)",
              maskImage:
                "radial-gradient(ellipse 52% 52% at 50% 48%, black 62%, transparent 88%)",
            }}
          />
        ) : (
          <div
            style={{
              filter:
                "drop-shadow(0 0 60px rgba(0,152,234,0.5)) drop-shadow(0 0 120px rgba(0,100,200,0.3))",
            }}
          >
            <OrbiterFallback />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- blue fire — outer / inner / core layers ---------- */
function Flames() {
  return (
    <motion.svg
      viewBox="0 0 340 220"
      animate={{ scaleY: [1, 1.08, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ originY: 1, x: "-50%" }}
      className="absolute bottom-[11%] left-1/2 z-[5] w-[110%]"
      aria-hidden
    >
      <defs>
        <filter id="orb-fblur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {/* outer */}
      <path
        d="M28 220 Q44 130 84 92 Q92 140 110 116 Q112 62 150 26 Q152 84 170 64 Q174 22 180 6 Q192 30 196 66 Q214 46 222 34 Q232 86 250 108 Q264 90 270 100 Q298 140 314 220Z"
        fill="rgba(0,100,200,0.3)"
        filter="url(#orb-fblur)"
      />
      {/* inner */}
      <path
        d="M62 220 Q78 150 106 124 Q113 152 128 136 Q138 92 170 64 Q174 108 188 92 Q198 120 214 134 Q228 122 240 148 Q256 175 274 220Z"
        fill="rgba(0,152,234,0.5)"
        filter="url(#orb-fblur)"
      />
      {/* core */}
      <path
        d="M98 220 Q112 168 134 154 Q144 172 160 160 Q170 138 180 144 Q196 162 212 172 Q226 184 240 220Z"
        fill="rgba(100,200,255,0.4)"
        filter="url(#orb-fblur)"
      />
    </motion.svg>
  );
}

/* ---------- fallback silhouette (until /public/mascot.png exists) ---------- */
function OrbiterFallback() {
  return (
    <svg viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <radialGradient id="orb-hood" cx="42%" cy="16%" r="95%">
          <stop offset="0%" stopColor="#232A35" />
          <stop offset="50%" stopColor="#11161E" />
          <stop offset="100%" stopColor="#04060A" />
        </radialGradient>
        <radialGradient id="orb-eye" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#E6F9FF" />
          <stop offset="40%" stopColor="#5CCFFF" />
          <stop offset="100%" stopColor="#0077CC" />
        </radialGradient>
        <filter id="orb-b3" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="orb-b6" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* cape flare */}
      <path d="M52 348 Q50 240 88 162 L212 162 Q250 240 248 348 Q200 336 150 338 Q100 336 52 348Z" fill="#070A10" />
      {/* cloak body */}
      <path d="M72 344 Q64 232 90 164 L210 164 Q236 232 228 344 Q190 334 150 336 Q110 334 72 344Z" fill="url(#orb-hood)" />
      {/* arms crossed */}
      <path d="M94 204 Q150 190 206 204 L198 232 Q150 218 102 232Z" fill="#161C26" />
      <path d="M94 204 Q150 190 206 204" stroke="#2A3340" strokeWidth="2" opacity=".7" fill="none" />
      {/* planet emblem */}
      <circle cx="150" cy="262" r="15" fill="none" stroke="#33BBFF" strokeWidth="3" filter="url(#orb-b3)" opacity=".9" />
      <circle cx="150" cy="262" r="15" fill="none" stroke="#5CCFFF" strokeWidth="2" />
      <ellipse cx="150" cy="262" rx="25" ry="8" fill="none" stroke="#5CCFFF" strokeWidth="2" transform="rotate(-22 150 262)" />

      {/* hood */}
      <path d="M150 12 Q212 20 224 90 Q230 130 212 152 L88 152 Q70 130 76 90 Q88 20 150 12Z" fill="url(#orb-hood)" />
      <path d="M104 26 Q150 12 196 26" stroke="#7E93AC" strokeWidth="6" strokeLinecap="round" opacity=".12" filter="url(#orb-b3)" />
      {/* face void */}
      <ellipse cx="150" cy="104" rx="52" ry="50" fill="#01030A" />

      {/* glowing eyes */}
      <g className="animate-pulse">
        <ellipse cx="126" cy="98" rx="20" ry="11" fill="#1E90FF" opacity=".5" filter="url(#orb-b6)" />
        <ellipse cx="174" cy="98" rx="20" ry="11" fill="#1E90FF" opacity=".5" filter="url(#orb-b6)" />
      </g>
      <ellipse cx="126" cy="98" rx="14" ry="6.5" fill="url(#orb-eye)" transform="rotate(-10 126 98)" />
      <ellipse cx="174" cy="98" rx="14" ry="6.5" fill="url(#orb-eye)" transform="rotate(10 174 98)" />
      <path d="M110 90 L140 96" stroke="#01030A" strokeWidth="6" strokeLinecap="round" />
      <path d="M190 90 L160 96" stroke="#01030A" strokeWidth="6" strokeLinecap="round" />

      {/* boots */}
      <path d="M104 322 L140 322 L138 350 Q120 354 102 350Z" fill="#0B0F16" />
      <path d="M160 322 L196 322 L198 350 Q180 354 162 350Z" fill="#0B0F16" />
      <path d="M102 350 Q120 355 138 350" stroke="#0098EA" strokeWidth="4" strokeLinecap="round" opacity=".8" filter="url(#orb-b3)" />
      <path d="M162 350 Q180 355 198 350" stroke="#0098EA" strokeWidth="4" strokeLinecap="round" opacity=".8" filter="url(#orb-b3)" />

      {/* blue rim lighting */}
      <path d="M224 70 Q234 120 222 158" stroke="#37AEFF" strokeWidth="4" strokeLinecap="round" opacity=".5" filter="url(#orb-b3)" fill="none" />
      <path d="M76 70 Q66 120 78 158" stroke="#2F8FE0" strokeWidth="3.5" strokeLinecap="round" opacity=".3" filter="url(#orb-b3)" fill="none" />
      <path d="M80 336 Q150 350 220 336" stroke="#2F9BFF" strokeWidth="5" strokeLinecap="round" opacity=".45" filter="url(#orb-b3)" fill="none" />
    </svg>
  );
}
