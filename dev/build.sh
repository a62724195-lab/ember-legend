#!/bin/bash
# يبني اللعبة من dev/src/*.js إلى dev/out.html ثم www/index.html (مع وسوم الـ head).
# يشتغل من أي مجلد: المسارات نسبية لمكان هذا الملف.
set -e
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"
cd "$HERE/src"

FILES="01_core.js 02_items.js 03_species.js 04_levels.js 05_world.js 06_sprites2.js 07_game.js 07b_quest.js 08_update.js 09_draw.js 09b_anim.js 11_extra.js 12_net.js 13_p2p.js 10_ui.js 14_story.js 14b_story.js 14c_story.js 14d_story_audio.js 14e_story2.js 14f_rc.js 14g_song.js 14h_ember.js 14i_hd_world.js 14j_hd_render.js 14k_hd_game.js 14l_hd_audio_npc.js 14m_hd_levels2.js 14n_hd_puzzles.js 14o_hd_boss.js 14p_hd_levels3.js 14q_hd_events.js 14r_touch_ctl.js 14s_intro_img.js 14s_intro.js 14t_update.js 14u_endless.js 14v_moves.js 14w_embers.js 14x_endboss.js 14y_secrets.js 14z_comfort.js 14za_daily.js 14zz_trailer.js"

# فحص الصياغة لكل ملف قبل التجميع
for f in $FILES; do
  [ -f "$f" ] || { echo "ملف ناقص: $f"; exit 1; }
  node --check "$f" || { echo "خطأ صياغة في $f"; exit 1; }
done

{ cat pre.html; echo '<script>'; echo '(()=>{'; cat $FILES; echo '})();'; echo '</script>'; } > "$HERE/out.html"

HEAD='<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أسطورة الجمر</title><meta name="theme-color" content="#0a0605"><meta name="mobile-web-app-capable" content="yes"><meta name="description" content="أسطورة الجمر: لعبة أكشن وقصة بعالم قلعة الجمر"><link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%}</style></head><body>'
{ printf '%s' "$HEAD"; cat "$HERE/out.html"; printf '</body></html>'; } > "$ROOT/www/index.html"

echo "BUILD_OK"; wc -c "$HERE/out.html" "$ROOT/www/index.html"
