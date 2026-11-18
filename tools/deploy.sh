#!/bin/sh
# Публікує свіжу версію: Mac → GitHub → https://meri-ua.github.io/
# Спершу ворота (npm run check): якщо щось не так — стоп ДО коміту й пушу.
cd "$(dirname "$0")/.." || exit 1
set -e
SITE="https://meri-ua.github.io/"

branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" != main ]; then
  echo "❌ Зараз гілка «$branch», а сайт публікується з main. Не публікую."; exit 1
fi

echo "1) Перевірка і збірка (npm run check)"
if ! ./tools/check.sh; then
  echo "\n❌ Перевірка не пройшла — НЕ публікую. Нічого не закомічено й не відправлено."; exit 1
fi

echo "2) Кладемо зібране в корінь (звідти GitHub Pages віддає сайт)"
# Список файлів сайту беремо з src/web, а не пишемо руками: так нічого не забудемо.
# check.sh (крок 8) уже переконався, що в dist/ немає нічого зайвого.
PUB="index.html $(ls src/web | tr '\n' ' ')"
for n in $PUB; do cp "dist/$n" .; done
echo "   $PUB"

echo "3) Записуємо в історію (лише файли сайту)"
# Не `git add -A`: той забрав би в «публікацію» все підряд — чернетки, чужі правки.
git add -- $PUB
if git diff --cached --quiet -- $PUB; then
  echo "   нічого нового — пропускаю"
else
  git commit -q -m "публікація $(date '+%Y-%m-%d %H:%M')" -- $PUB
  echo "   $(git log --oneline -1)"
fi
left=$(git status --porcelain -- src tools CODEMAP.md | wc -l | tr -d ' ')
if [ "$left" != 0 ]; then
  echo "   ⚠️ у src/, tools/ чи CODEMAP.md є незакомічені правки ($left): сайт зібрано"
  echo "      з них, але в історію вони не пішли — закоміть їх окремим комітом."
fi

echo "4) Відправляємо на GitHub"
git push -q origin main
echo "   ✅ відправлено"

echo "5) Ставимо тег публікації — точку, до якої можна відкотити сайт"
if git tag --points-at HEAD | grep -q '^pub-'; then
  echo "   цей коміт уже позначено: $(git tag --points-at HEAD | grep '^pub-' | head -1)"
else
  TAG="pub-$(date '+%Y%m%d-%H%M')"
  if git tag "$TAG" && git push -q origin "refs/tags/$TAG"; then echo "   🏷  $TAG"
  else echo "   ⚠️ тег $TAG не вдалося поставити — сайт опубліковано, тег постав руками"; fi
fi

echo "6) Чекаємо, поки GitHub оновить сайт (зазвичай до хвилини)"
WANT=$(shasum -a 256 index.html | cut -d' ' -f1)
i=0
while [ $i -lt 30 ]; do
  sleep 6; i=$((i+1))
  GOT=$(curl -sS --max-time 25 "$SITE?_=$(date +%s)" 2>/dev/null | shasum -a 256 | cut -d' ' -f1)
  if [ "$GOT" = "$WANT" ]; then
    echo "   ✅ сайт оновлено"; echo; echo "   $SITE"; exit 0
  fi
  printf '   чекаю… %ds\n' $((i*6))
done
echo "   ⚠️ за 3 хвилини сайт ще не оновився. Файл на GitHub уже є —"
echo "      подивись github.com/meri-ua/meri-ua.github.io/actions, чи не впала публікація."
exit 1
