#!/bin/bash
set -euo pipefail

SRC="/home/a20616050/projects/A/포토폴리오-260503"
DST="/home/a20616050/projects/A/junginsu-portfolio-v3/public"

# 새 고화질 증명사진 (메인)
if [ -f "$SRC/정인수 증명사진 고화질.png" ]; then
  cp "$SRC/정인수 증명사진 고화질.png" "$DST/photos/profile-hero.png"
elif [ -f "$SRC/정인수 증명사진 고화질.jpg" ]; then
  cp "$SRC/정인수 증명사진 고화질.jpg" "$DST/photos/profile-hero.jpg"
fi

# 강의 사진 (jpg, JPG, png 등)
shopt -s nullglob
for f in "$SRC/강의 사진/"*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
  cp "$f" "$DST/photos/teaching/" 2>/dev/null || true
done

# 자격증 9 images + PDF
for f in "$SRC/자격증 이미지/"*.{jpg,JPG,png,PNG,pdf}; do
  cp "$f" "$DST/certifications/" 2>/dev/null || true
done

# make.com 11 + 2 PDF
for f in "$SRC/make.com/"*.{jpg,JPG,JPEG,jpeg,pdf,txt}; do
  cp "$f" "$DST/automation/" 2>/dev/null || true
done

# 6 SaaS 폴더 — 한글/공백 폴더명 → 영문 슬러그 매핑
declare -A SAAS_MAP=(
  ["tickpoint"]="tickpoint"
  ["lumio"]="lumio"
  ["OS Agent"]="os-agent"
  ["MKT Automation"]="mkt-automation"
  ["propintel"]="propintel"
  ["아키텍처 시스템"]="architect"
)

for src_name in "${!SAAS_MAP[@]}"; do
  dst_slug="${SAAS_MAP[$src_name]}"
  src_dir="$SRC/github-vibe coding/$src_name"
  if [ -d "$src_dir" ]; then
    for f in "$src_dir"/*.{jpg,JPG,jpeg,JPEG,png,PNG}; do
      [ -f "$f" ] && cp "$f" "$DST/saas-folders/$dst_slug/" 2>/dev/null || true
    done
  fi
done

# 콘텐츠 레퍼런스
if [ -d "$SRC/github-vibe coding/MKT Automation/콘텐츠 레퍼런스" ]; then
  cp -r "$SRC/github-vibe coding/MKT Automation/콘텐츠 레퍼런스/"* "$DST/content-refs/" 2>/dev/null || true
fi

# 이력서 PDF
cp "$SRC/정인수 이력서.pdf" "$DST/resume.pdf"

echo "=== Asset copy 완료 ==="
echo "강의 사진: $(ls "$DST/photos/teaching/" 2>/dev/null | wc -l) 장"
echo "자격증: $(ls "$DST/certifications/" 2>/dev/null | wc -l) 파일"
echo "automation: $(ls "$DST/automation/" 2>/dev/null | wc -l) 파일"
for slug in tickpoint lumio os-agent mkt-automation propintel architect; do
  echo "$slug: $(ls "$DST/saas-folders/$slug/" 2>/dev/null | wc -l) 장"
done
