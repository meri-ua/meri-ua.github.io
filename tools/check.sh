#!/bin/sh
# Перевірка здоров'я проєкту — наша команда-доказ (npm run check).
# Код виходу важливий: за ним deploy.sh вирішує, чи можна публікувати.
cd "$(dirname "$0")/.." || exit 1
TMP=$(mktemp -d); bad=0
say(){ case "$2" in OK) echo "   ✅ $1";; *) echo "   ❌ $1 — $2"; bad=$((bad+1));; esac; }
jscheck(){ out=$(node --check "$1" 2>&1) && echo OK || echo "$out" | grep -m1 -E 'Error' ; }

if ! command -v node >/dev/null 2>&1; then
  echo "❌ немає Node.js — без нього синтаксис не перевірити. Постав: https://nodejs.org"; exit 1
fi

echo "1) Синтаксис JS (кожен файл src/ окремо):"
for f in src/data/*.js src/scripts/core/*.js; do
  [ -e "$f" ] || continue
  say "${f#src/}" "$(jscheck "$f")"
done

echo "2) Збірка:"
# Без пайпа: інакше код помилки збірки губився б, і далі перевірявся СТАРИЙ dist.
python3 tools/build.py > "$TMP/build.log" 2>&1; built=$?
sed 's/^/   /' "$TMP/build.log"
if [ "$built" != 0 ]; then
  echo "   ❌ збірка не вдалась — далі не перевіряю"
  rm -rf "$TMP"; echo "\nПроблем: $((bad+1))"; exit 1
fi

echo "3) Синтаксис так, як його бачить браузер (кожен <script> з dist/index.html):"
node tools/scriptcheck.js dist/index.html || bad=$((bad+1))

echo "4) Автономність (чи тягне сторінка щось із мережі при старті):"
ext=$(grep -ohE '<(script|link|img|iframe)[^>]*(src|href)="https?://[^"]*"' dist/*.html | sort -u)
if [ -z "$ext" ]; then
  echo "   ✅ жодного зовнішнього завантаження при старті"
else
  echo "   ❌ тягне з мережі при старті:"; echo "$ext" | sed 's/^/      /'; bad=$((bad+1))
fi

echo "5) Карта коду (CODEMAP.md):"
if out=$(python3 tools/codemap.py --check 2>&1); then echo "   ✅ $out"
else echo "   ❌ $out"; bad=$((bad+1)); fi

echo "6) Дати (toISOString().slice(0,10) — це день за UTC, вночі в Україні ще «вчора»):"
# Де справді потрібен UTC — допиши в рядок коментар // utc-ok.
utc=$(grep -rnE 'toISOString\(\)\.(slice|substr|substring)\(0, *10\)' src | grep -v 'utc-ok')
if [ -z "$utc" ]; then echo "   ✅ усі дні рахуються за місцевим часом (ymdLocal)"
else echo "   ❌ UTC-дата замість місцевої — заміни на ymdLocal():"; echo "$utc" | sed 's/^/      /'; bad=$((bad+1)); fi

echo "7) Секрети (репо публічне: ключ чи токен у коді побачить увесь світ):"
GL=""
for c in tools/bin/gitleaks "$HOME/frequency/tools/bin/gitleaks" "$(command -v gitleaks 2>/dev/null)"; do
  [ -n "$c" ] && [ -x "$c" ] && { GL=$c; break; }
done
if [ -n "$GL" ] && [ -d .git ]; then
  if "$GL" git . --redact --no-banner --log-level error > "$TMP/gl.log" 2>&1 \
     && "$GL" dir src --redact --no-banner --log-level error >> "$TMP/gl.log" 2>&1; then
    echo "   ✅ gitleaks: секретів не знайдено"
  else
    echo "   ❌ знайдено щось схоже на секрет (значення приховано):"
    grep -E "RuleID|File|Line" "$TMP/gl.log" | sed 's/^/      /'; bad=$((bad+1))
  fi
else
  # Запасна перевірка без gitleaks: найчастіші форми ключів.
  hits=$(grep -rnE '(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY|service_role)' src tools CLAUDE.md README.md 2>/dev/null | grep -v 'tools/check.sh')
  if [ -z "$hits" ]; then echo "   ✅ схожого на ключі не знайдено (простий пошук; gitleaks нема)"
  else echo "   ❌ схоже на секрет:"; echo "$hits" | cut -c1-120 | sed 's/^/      /'; bad=$((bad+1)); fi
fi

echo "8) Що поїде на сайт (у dist/ лише файли сайту):"
PUB="index.html $(ls src/web | tr '\n' ' ')"
extra=""
for f in dist/*; do
  n=$(basename "$f")
  case " $PUB " in *" $n "*) ;; *) extra="$extra $n";; esac
done
if [ -z "$extra" ]; then echo "   ✅ $PUB"
else echo "   ❌ у dist/ є зайве:$extra — макети й тестові файли тримай поза dist/"; bad=$((bad+1)); fi

rm -rf "$TMP"
[ "$bad" = 0 ] && { echo "\nВсе гаразд."; exit 0; }
echo "\nПроблем: $bad"; exit 1
