#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
codemap.py — будує CODEMAP.md: у якому файлі src/ і на якому рядку живе
кожна функція та константа верхнього рівня. Щоб AI-сесія спершу дивилась
карту, а не тягнула весь код у контекст.

  python3 tools/codemap.py          — перебудувати CODEMAP.md
  python3 tools/codemap.py --check  — лише перевірити, чи карта не відстала
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
OUT = os.path.join(ROOT, 'CODEMAP.md')

# function name(…) | const/let/var name = … — лише верхній рівень (без відступу)
DECL = re.compile(r'^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:const|let|var)\s+([A-Za-z_$][\w$]*)')
CSS_SEC = re.compile(r'^/\*\s*-{3,}\s*(.+?)\s*-{3,}\s*\*/')


def files(ext):
    res = []
    for d, _, ns in os.walk(SRC):
        for n in sorted(ns):
            if n.endswith(ext):
                res.append(os.path.join(d, n))
    return sorted(res)


def first_comment(text):
    m = re.match(r'\s*/\*\s*(.*?)\s*\*/', text, re.S)
    if not m:
        return ''
    line = m.group(1).split('\n')[0].strip()
    return line.split(' — ', 1)[1] if ' — ' in line else line


def build():
    js, css = files('.js'), files('.css')
    out = ['# CODEMAP — карта коду', '',
           '> **Цей файл створює скрипт. Руками не правити** — зміни зітруться.',
           '> Перебудувати: `npm run map`. Чи не відстала карта — скаже `npm run check`.',
           '>',
           '> Карта веде в `src/`, а не в `dist/index.html`: `dist` перезбирається щоразу.',
           '> **Навіщо:** спершу карта — потім читати лише потрібний файл.', '']
    total = 0
    body = []
    for p in js:
        rel = os.path.relpath(p, ROOT)
        text = open(p, encoding='utf-8').read()
        lines = text.split('\n')
        ents = []
        for i, l in enumerate(lines, 1):
            m = DECL.match(l)
            if m:
                ents.append((m.group(1) or m.group(2), i, 'ƒ' if m.group(1) or '=>' in l.split('=', 1)[-1][:40] else '·'))
        total += len(ents)
        body.append('### `%s` — %d рядків' % (rel, len(lines)))
        desc = first_comment(text)
        if desc:
            body.append('_%s_' % desc)
        body.append('')
        if ents:
            body.append(', '.join('`%s`%s:%d' % (n, '()' if k == 'ƒ' else '', i) for n, i, k in ents))
        body.append('')
    for p in css:
        rel = os.path.relpath(p, ROOT)
        lines = open(p, encoding='utf-8').read().split('\n')
        secs = [(m.group(1), i) for i, l in enumerate(lines, 1) for m in [CSS_SEC.match(l.strip())] if m]
        body.append('### `%s` — %d рядків' % (rel, len(lines)))
        body.append('')
        if secs:
            body.append(' · '.join('%s:%d' % s for s in secs))
        body.append('')
    out += ['## Огляд', '', '| Метрика | Значення |', '|---|---|',
            '| Файлів JS | %d |' % len(js), '| Файлів CSS | %d |' % len(css),
            '| Сутностей верхнього рівня | %d |' % total, '',
            'Позначки: `name()` — функція, `name` — значення; число — рядок у файлі.', '',
            '## Файли', ''] + body
    return '\n'.join(out).rstrip() + '\n'


def main():
    new = build()
    if '--check' in sys.argv:
        old = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
        if old == new:
            print('карта актуальна'); return
        print('карта відстала від коду — запусти npm run map'); sys.exit(1)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(new)
    print('CODEMAP.md оновлено')


main()
