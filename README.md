# ORBIT.FUN — Landing Page

Premium memecoin launchpad landing for TON. Next.js + TailwindCSS + Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Swap the mascot for a 3D render

1. Generate your mascot PNG (transparent background) with Midjourney / DALL-E.
   Suggested prompt:
   "3D render of a duck mascot wearing a black hoodie, glowing blue eyes,
   confident pose, surrounded by blue flames, dark background, premium
   gaming character, octane render, high detail"
2. Drop the file in /public/mascot.png
3. In components/Mascot.tsx replace <MascotSVG /> with:
   <img src="/mascot.png" alt="" className="w-full" />

Flames, glow, idle float and parallax keep working automatically.

## Structure

- app/page.tsx — all sections (Hero, Why, Trending, How It Works, Roadmap, Footer)
- components/Mascot.tsx — hooded duck + blue flames + idle animation
- components/SpaceBackground.tsx — particles, stars, floating TON symbols, mouse parallax
