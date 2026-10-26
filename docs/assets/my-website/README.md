# My-Website project image

Source supplied by Julien on 26 October 2026: `Capture d’écran 2026-10-26 à 18.53.24.png` (1918 × 968), preserved here as `hero-source.png`.

`node scripts/generate-website-project-media.mjs` extracts the introduction, portrait and interests (left 240, top 180, width 1440, height 600). Navigation and empty outer margins are omitted. Interface content is unchanged. Outputs are generated at 480, 800, 1200 and 1440 pixels, with no enlargement, in AVIF and WebP; metadata is removed from the served versions.

The generated `src/config/websiteMedia.js` imports versioned local assets. `ResponsiveImage` selects the appropriate size/format in both local preview and Vercel builds. The same image appears in the portfolio preview and the My-Website solution story; the redundant case-study hero screenshot has been removed.
