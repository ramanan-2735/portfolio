# Ramanan Dhakshanamoorthi — portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no three.js, no external scripts or image CDNs at runtime. Fonts are self-hosted.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

## Content

All text lives in `src/lib/data.ts` and comes from `Ramanan_Dhakshanamoorthi_Resume.pdf` (copied to `public/` so the **Résumé ↓** buttons download it). Components only read from that file. Nothing is invented: the résumé has no project repo links, location, LeetCode-style stats or testimonials, so none are shown.

## Sections

| # | Section | Component | Motion |
|---|---------|-----------|--------|
| – | Navigation | `Navigation.tsx` | frosted pill, sliding active indicator, progress bar, full-screen mobile menu |
| – | Hero | `hero/Hero.tsx` | looping intro video (multiply-blended), sound toggle, pauses below 35 % visibility |
| 01 | About | `sections/About.tsx` | pendulum-swing lanyard ID card that flips (hover / tap / Enter / Space) |
| 02 | Skills | `sections/Skills.tsx` | periodic-table grid, diagonal wave reveal, family filter, sticky inspector |
| 03 | Work | `sections/Work.tsx` | expanding accordion gallery with illustrative CSS UI |
| 04 | Certifications | `sections/Certifications.tsx` | ink-flood rows |
| 05 | Experience | `sections/Experience.tsx` | scroll-drawn timeline (experience + education) |
| 06 | Achievements | `sections/Achievements.tsx` | pinned horizontal gallery, count-up numbers |
| 07 | Contact | `sections/Contact.tsx` | hopping letters, copy-email chip, spinning badge, footer |

Nav links: About · Skills · Work · Experience · Achievements · Contact (Certifications is reachable by scrolling).

## Rebuilding the hero video

`scripts/build-hero-assets.py` needs `ffmpeg` and `numpy`.

```bash
python scripts/build-hero-assets.py path/to/intro.mp4 --photo path/to/portrait.png
# optional: --crop W:H:X:Y   --loop-seconds 10   --photo-crop W:H:X:Y
```

It detects the person and crops head-to-toe (4:5), scales to 768 px wide, whitens the backdrop (`colorlevels`), cross-fades the last 0.5 s of picture (ffmpeg `xfade`) and of audio (numpy, sample-accurate) into the start so the loop is seamless, and writes `public/hero/hero.mp4` (H.264 + AAC), `public/hero/hero.webm` (VP9 + Opus), `public/portrait-bust.webp` and `public/og.jpg`. Without `--photo`, the portrait is cut from the video frame (lower resolution). `public/hero/poster.webp` is the first frame:

```bash
ffmpeg -i public/hero/hero.mp4 -frames:v 1 -quality 80 public/hero/poster.webp
```

## QA

```bash
npm run build && npm start -- -p 3100
node scripts/qa.mjs shots              # screenshots at 1440, 1920, 390, 360 + overflow check
node scripts/qa-behaviour.mjs shots    # audio pause/resume, card flip, pinned scroll, mobile menu
```

## Credits & licences

- Brand logos in `public/logos/` are the “original” SVGs from [devicon](https://devicon.dev) (MIT — `public/logos/LICENSE-devicon.txt`). Logos remain trademarks of their owners.
- Fonts: Inter Tight, Instrument Serif, JetBrains Mono — SIL Open Font License 1.1 (via Fontsource).
- Concept icons are original line drawings in `src/components/ui/TechLogo.tsx`.
