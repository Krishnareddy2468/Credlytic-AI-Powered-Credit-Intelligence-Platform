"""Regenerate the Credlytic wordmark/lockup with a dimensional 'l' and 'i' tittle.

The 'l' stem and the tittle are repainted with the icon's own gradient ramp and
lit from the upper-left, matching the mark's 3D treatment. Each pixel keeps its
ORIGINAL coverage, so glyph shapes and antialiasing are untouched — only colour
is substituted.
"""
import pickle, zlib, struct, math

SCRATCH = "/private/tmp/claude-501/-Users-krishnareddy--my-Projects-credlytic/4b38c249-8a07-4785-ad6f-c0facc15df34/scratchpad"
w, h, rows = pickle.load(open(f"{SCRATCH}/logo.pkl", "rb"))
FLOOR, CEIL = 30.0, 52.0

MARK = (195, 334, 517, 654)
WORD = (572, 376, 1351, 578)
TAG  = (572, 580, 1350, 608)
FULL = (MARK[0], min(MARK[1], WORD[1]), WORD[2], max(MARK[3], TAG[3]))

# Glyph geometry measured from the artwork.
L_STEM = (1011, 392, 1033, 534)     # 'l' stem core
L_WIN  = (1003, 389, 1037, 538)     # repaint window ('d' ends 994, 'y' starts 1043)
DOT_C, DOT_R = (1231.0, 404.0), 14.5
DOT_WIN = (1213, 385, 1249, 422)    # tittle only; the 'i' stem starts at y=433

def clamp(v, lo=0.0, hi=1.0): return lo if v < lo else hi if v > hi else v
def ss(a, b, x):
    t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t)

# Gradient ramp sampled from the mark, held bright enough that the glyph stays
# legible against the near-black brand surface.
RAMP = [
    (0.00, (0x52, 0xE9, 0xF8)),
    (0.28, (0x24, 0xCB, 0xF4)),
    (0.60, (0x1B, 0x96, 0xEE)),
    (1.00, (0x14, 0x6F, 0xDC)),
]

def ramp(v):
    v = clamp(v)
    for i in range(len(RAMP) - 1):
        p0, c0 = RAMP[i]; p1, c1 = RAMP[i + 1]
        if v <= p1:
            t = (v - p0) / (p1 - p0)
            return tuple(c0[k] + (c1[k] - c0[k]) * t for k in range(3))
    return RAMP[-1][1]

def style_l(x, y):
    """Extruded, side-lit bar: vertical icon gradient x cylindrical shading."""
    u = clamp((x - L_STEM[0]) / (L_STEM[2] - L_STEM[0]))
    v = clamp((y - L_STEM[1]) / (L_STEM[3] - L_STEM[1]))
    base = ramp(v)
    # Cylindrical falloff. The shadow side bottoms out at 0.62 rather than 0.50:
    # any darker and the left edge sinks into the near-black surface, which reads
    # as a notch in the stem instead of shading.
    shade = (0.62 + 0.38 * ss(0.0, 0.34, u)) * (1.0 - 0.16 * ss(0.80, 1.0, u))
    # Restrained specular band from the upper-left, fading down the stem. Kept
    # low so the icon's cyan stays dominant rather than blowing out to white.
    spec = 0.26 * math.exp(-(((u - 0.33) / 0.13) ** 2)) * (1.0 - 0.50 * v)
    return tuple(clamp(base[k] * shade + 255.0 * spec, 0, 255) for k in range(3))

def style_dot(x, y):
    """Glossy bead: diffuse + specular sphere shading in the icon's cyan."""
    dx = (x + 0.5 - DOT_C[0]) / DOT_R
    dy = (y + 0.5 - DOT_C[1]) / DOT_R
    d2 = dx * dx + dy * dy
    z = math.sqrt(max(0.0, 1.0 - min(d2, 1.0)))
    ln = 1.0 / math.sqrt(0.42 ** 2 + 0.55 ** 2 + 0.72 ** 2)
    lx, ly, lz = -0.42 * ln, -0.55 * ln, 0.72 * ln
    diff = max(0.0, dx * lx + dy * ly + z * lz)
    base = (0x22, 0xD1, 0xF4)
    out = [base[k] * (0.40 + 0.62 * diff) for k in range(3)]
    # Blinn-Phong specular with the viewer on the z axis.
    hx, hy, hz = lx, ly, lz + 1.0
    hn = 1.0 / math.sqrt(hx * hx + hy * hy + hz * hz)
    nh = max(0.0, dx * hx * hn + dy * hy * hn + z * hz * hn)
    spec = 0.95 * (nh ** 30)
    # Cool bounce light on the lower-right rim.
    rim = 0.20 * (min(d2, 1.0) ** 1.5) * max(0.0, dx * 0.55 + dy * 0.62)
    return tuple(clamp(out[k] + 255.0 * spec + (0x5A, 0xC8, 0xF0)[k] * rim, 0, 255) for k in range(3))

def sample(x, y, mask_tagline):
    if mask_tagline and x >= 540 and y >= 579:
        return 0.0, 0.0, 0.0, 0.0
    o = x * 4
    r, g, b, a = rows[y][o], rows[y][o+1], rows[y][o+2], rows[y][o+3]
    f = a / 255.0
    r, g, b = r * f, g * f, b * f
    br = max(r, g, b)
    cov = 0.0 if br <= FLOOR else (1.0 if br >= CEIL else (br - FLOOR) / (CEIL - FLOOR))
    if cov > 0.0:
        if L_WIN[0] <= x <= L_WIN[2] and L_WIN[1] <= y <= L_WIN[3]:
            c = style_l(x, y); return c[0]*cov, c[1]*cov, c[2]*cov, cov
        if DOT_WIN[0] <= x <= DOT_WIN[2] and DOT_WIN[1] <= y <= DOT_WIN[3]:
            c = style_dot(x, y); return c[0]*cov, c[1]*cov, c[2]*cov, cov
    return r, g, b, cov

def write_png(path, ow, oh, lines):
    raw = bytearray()
    for ln in lines: raw.append(0); raw += ln
    def chunk(t, d):
        c = t + d
        return struct.pack(">I", len(d)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", ow, oh, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
    open(path, "wb").write(png)
    return len(png)

def render(box, out_h, pad=5, mask_tagline=False):
    b = (box[0]-pad, box[1]-pad, box[2]+pad, box[3]+pad)
    sw, sh = b[2]-b[0]+1, b[3]-b[1]+1
    scale = out_h / sh
    ow, step = round(sw*scale), sh/out_h
    lines = []
    for ty in range(out_h):
        line = bytearray()
        for tx in range(ow):
            ax0, ay0 = b[0]+tx*step, b[1]+ty*step
            sr=sg=sb=sa=0.0; n=0
            for yy in range(int(ay0), int(ay0+step)+1):
                for xx in range(int(ax0), int(ax0+step)+1):
                    if b[0] <= xx <= b[2] and b[1] <= yy <= b[3] and 0 <= xx < w and 0 <= yy < h:
                        rr,gg,bb,cov = sample(xx, yy, mask_tagline)
                        sr+=rr; sg+=gg; sb+=bb; sa+=cov; n+=1
            if n == 0 or sa == 0:
                line += bytes((0,0,0,0)); continue
            aa = sa/n
            line += bytes(tuple(min(255,max(0,round((c/n)/aa))) for c in (sr,sg,sb)) + (min(255,max(0,round(aa*255))),))
        lines.append(line)
    return ow, out_h, lines

def square_icon(out, inset, plate=None):
    """Square icon: the mark centred with `inset` fraction of margin."""
    cx, cy = (MARK[0]+MARK[2])/2, (MARK[1]+MARK[3])/2
    side = max(MARK[2]-MARK[0], MARK[3]-MARK[1]) * (1 + inset)
    step = side / out
    sx0, sy0 = cx - side/2, cy - side/2
    lines = []
    for ty in range(out):
        line = bytearray()
        for tx in range(out):
            ax0, ay0 = sx0 + tx*step, sy0 + ty*step
            sr=sg=sb=sa=0.0; n=0
            for yy in range(int(ay0), int(ay0+step)+1):
                for xx in range(int(ax0), int(ax0+step)+1):
                    if MARK[0]-10 <= xx <= MARK[2]+10 and MARK[1]-10 <= yy <= MARK[3]+10 and 0 <= xx < w and 0 <= yy < h:
                        r,g,b,cov = sample(xx, yy, False)
                        sr+=r; sg+=g; sb+=b; sa+=cov; n+=1
            if n == 0 or sa == 0:
                line += bytes(plate + (255,)) if plate else bytes((0,0,0,0)); continue
            aa = sa/n
            rgb = [min(255, max(0, (c/n)/aa)) for c in (sr,sg,sb)]
            if plate:
                line += bytes(tuple(round(c*aa + pp*(1-aa)) for c,pp in zip(rgb, plate)) + (255,))
            else:
                line += bytes(tuple(round(c) for c in rgb) + (min(255,max(0,round(aa*255))),))
        lines.append(line)
    return lines


if __name__ == "__main__":
    ow, oh, lines = render(MARK, 160)
    print(f"mark.png     {ow}x{oh}: {write_png('public/brand/mark.png', ow, oh, lines)} bytes")
    print(f"icon.png     128x128: {write_png('app/icon.png', 128, 128, square_icon(128, 0.10))} bytes")
    print(f"apple-icon   180x180: {write_png('app/apple-icon.png', 180, 180, square_icon(180, 0.34, plate=(5, 12, 22)))} bytes")
    ow, oh, lines = render(WORD, 128)
    print(f"wordmark.png {ow}x{oh}: {write_png('public/brand/wordmark.png', ow, oh, lines)} bytes")
    ow, oh, lines = render(FULL, 200)
    print(f"lockup.png   {ow}x{oh}: {write_png('public/brand/lockup.png', ow, oh, lines)} bytes")
    # Large preview on the brand surface
    ow, oh, lines = render(WORD, 300)
    pv = []
    for ty in range(oh):
        line = bytearray()
        for tx in range(ow):
            o = tx*4
            r,g,b,a = lines[ty][o], lines[ty][o+1], lines[ty][o+2], lines[ty][o+3]
            f = a/255
            line += bytes(tuple(round(c*f + p*(1-f)) for c,p in zip((r,g,b),(3,7,13))) + (255,))
        pv.append(line)
    write_png(f"{SCRATCH}/style-preview.png", ow, oh, pv)
    print("preview written")
