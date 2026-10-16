"""期間が終わった記事をサイトから削除する（GitHub Actions で毎日0時すぎ・日本時間に実行）。

- 記事の <head> に <meta name="expires" content="2026-11-30"> があり、その日を過ぎた記事が対象（その日までは表示）。
- 記事のファイル、TOPのカード・スライド・ランキング、地図のピン（map.js の PINS）、sitemap.xml の行を消す。
- data-expires="YYYY-MM-DD" がついた要素は、どのページでも期限を過ぎたら消す（関連記事への案内など）。
- ほかのページに残った、消した記事へのリンクは、リンクだけ外して文字は残す。

使い方：python .github/scripts/expire_articles.py [--today 2026-12-01] [--dry-run]
"""
import argparse
import datetime
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
JST = datetime.timezone(datetime.timedelta(hours=9))


def read(path):
    with open(path, encoding="utf-8", newline="") as f:
        return f.read()


def write(path, text):
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def find_element_end(html, start, tag):
    """start の位置にある <tag ...> の、対応する閉じタグの終わりの位置を返す。"""
    pattern = re.compile(r"<(/?)%s\b[^>]*>" % tag, re.I)
    depth = 0
    for m in pattern.finditer(html, start):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return m.end()
    return -1


def remove_elements(html, predicate):
    """predicate(開始タグ, タグ名, 要素全体) が真の要素を消す。前後の空行も整える。"""
    out = html
    pos = 0
    start_tag = re.compile(r"<(li|article|p|div|section|tr|aside)\b[^>]*>", re.I)
    while True:
        m = start_tag.search(out, pos)
        if not m:
            break
        tag = m.group(1).lower()
        end = find_element_end(out, m.start(), tag)
        if end == -1:
            pos = m.end()
            continue
        block = out[m.start():end]
        if predicate(m.group(0), tag, block):
            line_start = out.rfind("\n", 0, m.start()) + 1
            s = line_start if out[line_start:m.start()].strip() == "" else m.start()
            e = end
            if out[end:end + 1] == "\n":
                e += 1
            out = out[:s] + out[e:]
            pos = s
        else:
            pos = m.end()
    return out


def expired_date(value, today):
    try:
        return datetime.date.fromisoformat(value.strip()) < today
    except ValueError:
        return False


def fix_dots(html):
    """スライドの枚数に合わせて、TOPのスライドの点を作り直す。"""
    slides = len(re.findall(r'<article class="slide"', html))
    m = re.search(r'(<div class="dots"[^>]*>)(.*?)(\n\s*</div>)', html, re.S)
    if not m:
        return html
    indent = "\n        "
    dots = "".join(
        '%s<button type="button" class="dot%s" aria-label="%d枚目" aria-selected="%s"></button>'
        % (indent, " is-active" if i == 0 else "", i + 1, "true" if i == 0 else "false")
        for i in range(slides)
    )
    return html[:m.start()] + m.group(1) + dots + m.group(3) + html[m.end():]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--today", help="判定に使う日付（YYYY-MM-DD）。省略時は日本時間の今日")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    today = datetime.date.fromisoformat(args.today) if args.today else datetime.datetime.now(JST).date()

    expired = []
    for f in sorted((ROOT / "articles").glob("*.html")):
        m = re.search(r'<meta name="expires" content="([^"]+)"', read(f))
        if m and expired_date(m.group(1), today):
            expired.append(f)
    names = [f.name for f in expired]

    def links_expired(block):
        return any(re.search(r'href="(?:\.\./|\./)?(?:articles/)?%s"' % re.escape(n), block) for n in names)

    def is_expired_el(start_tag, tag, block):
        m = re.search(r'data-expires="([^"]+)"', start_tag)
        if m and expired_date(m.group(1), today):
            return True
        # TOPのカード・スライド・ランキングの1件
        if names and tag in ("li", "article") and links_expired(block) and (
            'class="post' in start_tag or 'class="slide' in start_tag or tag == "li" and block.count("<a ") == 1 and "ranking-title" in block
        ):
            return True
        return False

    changed = []
    for page in sorted(list(ROOT.glob("*.html")) + list((ROOT / "articles").glob("*.html"))):
        if page in expired:
            continue
        html = read(page)
        new = remove_elements(html, is_expired_el)
        for n in names:
            # 残ったリンクは外して文字だけ残す
            new = re.sub(r'<a [^>]*href="(?:\.\./|\./)?(?:articles/)?%s"[^>]*>(.*?)</a>' % re.escape(n), r"\1", new, flags=re.S)
        if page.name == "index.html":
            new = fix_dots(new)
        if new != html:
            changed.append(page)
            if not args.dry_run:
                write(page, new)

    for rel, line_pat in (("assets/js/map.js", r'url: "articles/%s"'), ("sitemap.xml", r"/articles/%s<")):
        p = ROOT / rel
        text = read(p)
        lines = text.splitlines(keepends=True)
        kept = [l for l in lines if not any(re.search(line_pat % re.escape(n), l) for n in names)]
        if rel.endswith("map.js"):
            # 期限つきのピン（expires: "YYYY-MM-DD"）も消す
            kept = [l for l in kept if not (re.search(r'expires: "([^"]+)"', l) and expired_date(re.search(r'expires: "([^"]+)"', l).group(1), today))]
            # 最後のピンの後ろのカンマを外す
            new = re.sub(r",(\s*\n\s*\];)", r"\1", "".join(kept))
        else:
            new = "".join(kept)
        if new != text:
            changed.append(p)
            if not args.dry_run:
                write(p, new)

    for f in expired:
        if not args.dry_run:
            f.unlink()

    sys.stdout.reconfigure(encoding="utf-8")
    print("判定日:", today.isoformat())
    print("削除した記事:", ", ".join(names) if names else "なし")
    print("更新したファイル:", ", ".join(str(p.relative_to(ROOT)) for p in changed) if changed else "なし")
    return 0


if __name__ == "__main__":
    sys.exit(main())
