#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build.py — збирає src/ в один файл dist/index.html.
Це і є «готова програма»: саме її відкриває браузер і телефон.
Правиш файли в src/ → запускаєш `npm run build` → отримуєш dist/index.html.

Мітки в src/index.html:
  @@INCDIR:тека@@  — вклеїти всі файли теки за абеткою (номер у назві = порядок)
  @@INC:файл@@     — вклеїти один файл
  @@BUILD@@        — версія збірки: дата + короткий git-хеш («+» = є незакомічені правки src/)
Файли з src/web/ копіюються в dist/ як є (сторінка порівняння дизайнів тощо).
"""
import os, re, shutil, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
DIST = os.path.join(ROOT, 'dist')


def read(p):
    with open(p, 'r', encoding='utf-8', newline='') as f:
        return f.read()


def build_stamp():
    try:
        h = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD'],
                                    cwd=ROOT, stderr=subprocess.DEVNULL).decode().strip()
        dirty = subprocess.check_output(['git', 'status', '--porcelain', '--', 'src'],
                                        cwd=ROOT, stderr=subprocess.DEVNULL).decode().strip()
        if dirty:
            h += '+'
    except Exception:
        h = 'nogit'
    return time.strftime('%Y-%m-%d-%H%M') + '-' + h


def main():
    html = read(os.path.join(SRC, 'index.html'))
    used, missing, strays = [], [], []

    def inc(m):
        rel = m.group(1)
        p = os.path.join(SRC, rel)
        if not os.path.isfile(p):
            missing.append(rel); return ''
        used.append(rel)
        return read(p)

    def incdir(m):
        rel = m.group(1)
        d = os.path.join(SRC, rel)
        if not os.path.isdir(d):
            missing.append(rel + '/'); return ''
        # Уся тека вклеюється в ОДИН <script> чи <style>, тож у ній мають бути
        # лише файли коду одного виду. Забута копія «13-coins.js.bak» інакше
        # тихо стала б частиною програми.
        names = [n for n in sorted(os.listdir(d)) if not n.startswith('.')]
        exts = [os.path.splitext(n)[1] for n in names if os.path.splitext(n)[1] in ('.js', '.css')]
        kind = max(set(exts), key=exts.count) if exts else None
        parts = []
        for n in names:
            if os.path.splitext(n)[1] != kind:
                strays.append(rel + '/' + n); continue
            used.append(rel + '/' + n)
            parts.append(read(os.path.join(d, n)))
        return '\n'.join(parts)

    out = re.sub(r'@@INCDIR:([^@]+)@@', incdir, html)
    out = re.sub(r'@@INC:([^@]+)@@', inc, out)
    stamp = build_stamp()
    out = out.replace('@@BUILD@@', stamp)

    if missing:
        print('ПОМИЛКА — немає файлів:'); [print('  ' + m) for m in missing]; sys.exit(1)
    if strays:
        print('ПОМИЛКА — у теці, яка цілком вклеюється в програму, є зайві файли:')
        [print('  ' + m) for m in strays]
        print('Там можна тримати лише .js або лише .css. Прибери зайве і збери знову.')
        sys.exit(1)
    left = re.findall(r'@@[A-Z]+[^@]*@@', out)
    if left:
        print('ПОМИЛКА — лишились невідомі мітки: ' + ', '.join(sorted(set(left)))); sys.exit(1)

    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    with open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8', newline='') as f:
        f.write(out)
    print('Зібрано %d частин → dist/index.html (%.1f KB, %d рядків), версія %s'
          % (len(used), len(out.encode('utf-8')) / 1024, out.count('\n') + 1, stamp))

    wsrc = os.path.join(SRC, 'web')
    if os.path.isdir(wsrc):
        names = sorted(n for n in os.listdir(wsrc) if not n.startswith('.'))
        for n in names:
            shutil.copy2(os.path.join(wsrc, n), os.path.join(DIST, n))
        print('Скопійовано в dist/: %s' % ', '.join(names))


main()
