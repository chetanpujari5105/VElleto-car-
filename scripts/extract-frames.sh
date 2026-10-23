#!/usr/bin/env bash
# Turn the final Flow/Veo video into the scroll frame sets the site paints.
#
#   scripts/extract-frames.sh [public/source-video/final.mp4]
#
# Writes
#   public/images/car-sequence/N.jpg          1920w JPEG (fallback)
#   public/images/car-sequence-webp/N.webp    1920w WebP (desktop)
#   public/images/car-sequence-mobile/N.webp  960w WebP (phones)
#   public/images/poster.jpg, public/og.jpg, public/images/stills/*.jpg
# and updates TOTAL_FRAMES in data/carData.ts.
#
# Needs ffmpeg and cwebp. Env: CROP="w:h:x:y" to trim Flow's corner watermark before scaling.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/public/source-video/final.mp4}"
OUT="$ROOT/public/images"
JPG="$OUT/car-sequence"
WEBP="$OUT/car-sequence-webp"
MOB="$OUT/car-sequence-mobile"
CROP="${CROP:-}"
pre=""
[[ -n "$CROP" ]] && pre="crop=$CROP,"

rm -f "$JPG"/*.jpg "$WEBP"/*.webp "$MOB"/*.webp
mkdir -p "$JPG" "$WEBP" "$MOB" "$OUT/stills"

ffmpeg -hide_banner -loglevel error -y -i "$SRC" \
  -vf "${pre}fps=30,scale=1920:-2:flags=lanczos" -q:v 3 "$JPG/%d.jpg"

COUNT=$(find "$JPG" -name '*.jpg' | wc -l | tr -d ' ')
echo "frames: $COUNT"

# WebP sets, 8 encodes at a time.
seq 1 "$COUNT" | xargs -P 8 -I{} cwebp -quiet -q 76 -m 5 "$JPG/{}.jpg" -o "$WEBP/{}.webp"
seq 1 "$COUNT" | xargs -P 8 -I{} cwebp -quiet -q 72 -m 5 -resize 960 0 "$JPG/{}.jpg" -o "$MOB/{}.webp"

sed -i '' -E "s/^export const TOTAL_FRAMES = [0-9]+;/export const TOTAL_FRAMES = $COUNT;/" "$ROOT/data/carData.ts"

# Poster (reduced motion) = the last frame; OG card = a 1200×630 crop of it.
cp "$JPG/$COUNT.jpg" "$OUT/poster.jpg"
ffmpeg -hide_banner -loglevel error -y -i "$JPG/$COUNT.jpg" \
  -vf "scale=1200:-2,crop=1200:630" -q:v 3 "$ROOT/public/og.jpg"

# Feature card stills (4:5). Args: name, frame %, centre x %, centre y %, crop height %.
still() {
  local n=$(( (COUNT - 1) * $2 / 100 + 1 ))
  ffmpeg -hide_banner -loglevel error -y -i "$JPG/$n.jpg" \
    -vf "crop=ih*$5/100*4/5:ih*$5/100:iw*$3/100-ih*$5/100*2/5:ih*$4/100-ih*$5/200,scale=800:1000" \
    -q:v 3 "$OUT/stills/$1.jpg"
}
still form 31 40 52 62
still wheel 31 29 66 40
still cockpit 100 46 46 74

du -sh "$JPG" "$WEBP" "$MOB"
