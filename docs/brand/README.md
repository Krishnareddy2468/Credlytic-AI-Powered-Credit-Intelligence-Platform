# Credlytic brand assets

Source artwork: `Credlytic Logo1.png` (repo root) — a 1536x1024 flat raster with a
near-black background at varying alpha.

`generate-brand-assets.py` derives every shipped asset from it. Run from
`frontend/`:

```sh
python3 ../docs/brand/generate-brand-assets.py
```

Outputs:

| File | Size | Use |
|---|---|---|
| `frontend/public/brand/mark.png` | 161x160 | the C mark, used in the lockup |
| `frontend/public/brand/wordmark.png` | 475x128 | "Credlytic" wordmark |
| `frontend/public/brand/lockup.png` | 705x200 | full lockup incl. baked tagline |
| `frontend/app/icon.png` | 128x128 | favicon (transparent) |
| `frontend/app/apple-icon.png` | 180x180 | touch icon (plated, inset) |

## How it works

**Keying.** The source background is near-black at partial alpha. Pixels are
composited over black, then coverage is ramped between `FLOOR` (30) and `CEIL`
(52) on max-channel brightness. The background sits at 23-24 and a faint flare
above the `l` reaches 32, so a floor of 30 removes both without eroding glyph
edges (glyph cores are 240+, the mark's darkest real tone is 57).

**Measured glyph geometry** (source pixels):

```
mark      195,334 - 517,654      wordmark  572,376 - 1351,578
tagline   572,580 - 1350,608     'l' stem  1011,392 - 1033,534
'i' tittle centre (1231,404) r=14.5
```

The wordmark and tagline share identical left/right edges in the source — the
lockup component reproduces that flush relationship in CSS.

**Styled `l` and tittle.** Both are repainted with the mark's own gradient ramp
and lit from the upper-left: the `l` as a shaded extruded bar, the tittle as a
Blinn-Phong bead. Each pixel keeps its ORIGINAL coverage and only its colour is
substituted, so glyph shapes and antialiasing are bit-for-bit unchanged.

**Tagline.** Baked into `lockup.png` only. The site renders it as live text
(see `components/landing/brand-lockup.tsx`) because at 0.090x the mark height it
would rasterise under 5px in a header.
