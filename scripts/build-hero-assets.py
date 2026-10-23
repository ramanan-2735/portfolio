#!/usr/bin/env python3
"""Turn the intro video into a seamless looping hero clip.

usage: python scripts/build-hero-assets.py <intro.mp4> [--photo portrait.png] [--crop W:H:X:Y] [--loop-seconds 10]

Needs ffmpeg/ffprobe on PATH and numpy.
Outputs: public/hero/hero.mp4, public/hero/hero.webm, public/portrait-bust.webp, public/og.jpg
"""
import argparse, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
FADE = 0.5          # seconds of cross-fade
OUT_W = 768         # hero width in px
SR = 48000


def run(*cmd):
    subprocess.run([str(c) for c in cmd], check=True)


def probe(src):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height", "-of", "csv=p=0", str(src)],
                       capture_output=True, text=True, check=True)
    w, h = (int(x) for x in r.stdout.strip().split(","))
    return w, h


def detect_crop(src, w, h):
    """Find the person's bounding box (non-white pixels) over a few frames, return a 4:5 crop centred on them."""
    boxes = []
    for t in (0.5, 2.5, 5, 7.5):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", str(src), "-frames:v", "1",
                              "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True).stdout
        if len(raw) != w * h:
            continue
        g = np.frombuffer(raw, np.uint8).reshape(h, w)
        mask = g < 200
        # ignore stray edge shadows: require a few dark pixels per row/col
        rows = np.where(mask.sum(1) > 3)[0]
        cols = np.where(mask.sum(0) > 3)[0]
        if len(rows) and len(cols):
            boxes.append((cols[0], rows[0], cols[-1], rows[-1]))
    if not boxes:
        sys.exit("could not detect the person; pass --crop W:H:X:Y")
    x0 = min(b[0] for b in boxes); y0 = min(b[1] for b in boxes)
    x1 = max(b[2] for b in boxes); y1 = max(b[3] for b in boxes)
    ch = min(h, int((y1 - y0) * 1.06))
    ch -= ch % 2
    cw = int(ch * 0.8)
    cw -= cw % 2
    cx = (x0 + x1) // 2
    x = int(np.clip(cx - cw // 2, 0, w - cw))
    y = int(np.clip((y0 + y1) // 2 - ch // 2, 0, h - ch))
    return cw, ch, x, y


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--photo")
    ap.add_argument("--crop")
    ap.add_argument("--loop-seconds", type=float, default=10)
    ap.add_argument("--photo-crop", default="1000:1250:57:20", help="W:H:X:Y crop for the portrait photo (4:5)")
    a = ap.parse_args()
    src = Path(a.src).resolve()
    (OUT / "hero").mkdir(parents=True, exist_ok=True)

    w, h = probe(src)
    cw, ch, cx, cy = map(int, a.crop.split(":")) if a.crop else detect_crop(src, w, h)
    print(f"crop {cw}x{ch} at {cx},{cy}")
    D = a.loop_seconds
    vf_base = (f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:-2:flags=lanczos,"
               "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,fps=24,format=yuv420p")

    tmp = Path(tempfile.mkdtemp(prefix="hero-"))
    # ---- audio: sample-accurate cross-fade in numpy
    wav = tmp / "a.wav"
    run("ffmpeg", "-v", "error", "-y", "-i", src, "-t", D, "-vn", "-ac", "2", "-ar", SR, "-c:a", "pcm_s16le", wav)
    with wave.open(str(wav)) as wf:
        ch_n = wf.getnchannels()
        pcm = np.frombuffer(wf.readframes(wf.getnframes()), np.int16).reshape(-1, ch_n).astype(np.float64)
    n = int(D * SR)
    pcm = pcm[:n]
    f = int(FADE * SR)
    t = np.linspace(0, np.pi / 2, f)[:, None]
    head, tail = pcm[:f], pcm[len(pcm) - f:]
    out = pcm[: len(pcm) - f].copy()
    out[:f] = head * np.sin(t) + tail * np.cos(t)    # equal-power blend of tail into head
    looped = tmp / "loop.wav"
    with wave.open(str(looped), "wb") as wo:
        wo.setnchannels(ch_n); wo.setsampwidth(2); wo.setframerate(SR)
        wo.writeframes(np.clip(out, -32768, 32767).astype(np.int16).tobytes())

    # ---- video: tail fades into head (xfade), so the loop point is continuous
    vid = tmp / "loop.mp4"
    fc = (f"[0:v]trim=start={D - FADE}:end={D},setpts=PTS-STARTPTS[tail];"
          f"[0:v]trim=start=0:end={D - FADE},setpts=PTS-STARTPTS[main];"
          f"[tail][main]xfade=transition=fade:duration={FADE}:offset=0,{vf_base}[v]")
    run("ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]", "-an",
        "-c:v", "libx264", "-crf", "12", "-preset", "fast", vid)

    # ---- encode
    run("ffmpeg", "-v", "error", "-y", "-i", vid, "-i", looped, "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest", OUT / "hero" / "hero.mp4")
    run("ffmpeg", "-v", "error", "-y", "-i", vid, "-i", looped, "-map", "0:v", "-map", "1:a",
        "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
        "-c:a", "libopus", "-b:a", "80k", "-shortest", OUT / "hero" / "hero.webm")

    # ---- portrait + og image
    if a.photo:
        pw, ph, px, py = map(int, a.photo_crop.split(":"))
        run("ffmpeg", "-v", "error", "-y", "-i", a.photo, "-vf", f"crop={pw}:{ph}:{px}:{py},scale=480:600:flags=lanczos",
            "-frames:v", "1", "-quality", "86", OUT / "portrait-bust.webp")
    else:
        # head-to-shirt from the clearest (mid) frame of the cropped hero
        run("ffmpeg", "-v", "error", "-y", "-ss", "3", "-i", src, "-vf",
            f"crop={cw}:{ch}:{cx}:{cy},crop=iw*0.46:iw*0.46*1.25:iw*0.27:ih*0.0,scale=480:600:flags=lanczos,"
            "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98", "-frames:v", "1", "-quality", "90", OUT / "portrait-bust.webp")
    run("ffmpeg", "-v", "error", "-y", "-ss", "3", "-i", src, "-vf",
        f"crop={cw}:{ch}:{cx}:{cy},scale=-2:630,pad=1200:630:(ow-iw)/2:0:white,colorlevels=rimax=0.98:gimax=0.98:bimax=0.98",
        "-frames:v", "1", "-q:v", "3", OUT / "og.jpg")
    print("done:", *(p.name for p in sorted((OUT / "hero").iterdir())))


if __name__ == "__main__":
    main()
