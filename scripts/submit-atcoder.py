#!/usr/bin/env python3
"""AtCoderへ提出する。

`oj submit`は問題ページの「Memory Limit: 1024 MiB」を解析できず（MB/KBしか想定していない）、
提出前にAssertionErrorで落ちる。ここでは提出フォームだけを直接叩く。
"""

import html
import os
import re
import sys
from http.cookiejar import LWPCookieJar
from pathlib import Path

import requests

DEFAULT_LANGUAGE = "JavaScript Bun"
USER_AGENT = "Mozilla/5.0 (compatible; atcoder-playground)"


def cookie_path() -> Path:
    data_home = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    return data_home / "online-judge-tools" / "cookie.jar"


def new_session() -> requests.Session:
    path = cookie_path()
    if not path.exists():
        raise SystemExit("cookieがありません。bun run login を実行してください。")
    jar = LWPCookieJar(path)
    jar.load(ignore_discard=True, ignore_expires=True)
    session = requests.Session()
    session.cookies = jar
    session.headers["User-Agent"] = USER_AGENT
    return session


def parse_problem(url: str) -> tuple[str, str]:
    matched = re.match(r"https://atcoder\.jp/contests/([^/]+)/tasks/([^/?#]+)", url)
    if not matched:
        raise SystemExit(f"問題URLとして解釈できません: {url}")
    return matched.group(1), matched.group(2)


def languages_of(page: str) -> dict[str, str]:
    found = re.findall(r'<option value="(\d+)"[^>]*>([^<]+)</option>', page)
    return {id_: html.unescape(name).strip() for id_, name in found}


def resolve_language(languages: dict[str, str], query: str) -> str:
    if query.isdigit():
        if query not in languages:
            raise SystemExit(f"言語ID {query} はこのコンテストにありません。")
        return query
    words = query.lower().split()
    matched = [id_ for id_, name in languages.items() if all(word in name.lower() for word in words)]
    if not matched:
        raise SystemExit(f"言語「{query}」に一致するものがありません。")
    if len(matched) > 1:
        candidates = "\n".join(f"  {id_} {languages[id_]}" for id_ in sorted(matched))
        raise SystemExit(f"言語「{query}」が複数に一致しました。ATCODER_LANGUAGEで絞ってください。\n{candidates}")
    return matched[0]


def alerts(page: str) -> list[str]:
    blocks = re.findall(r'<div class="alert alert-(?:danger|warning)[^"]*">(.*?)</div>', page, re.S)
    return [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", block)).strip() for block in blocks]


def main() -> None:
    args = [value for value in sys.argv[1:] if value != "--dry-run"]
    dry_run = "--dry-run" in sys.argv[1:]
    if len(args) < 2:
        raise SystemExit("usage: submit-atcoder.py <問題URL> <ファイル> [言語]")
    url, file_path = args[0], args[1]
    query = args[2] if len(args) > 2 else os.environ.get("ATCODER_LANGUAGE") or DEFAULT_LANGUAGE

    contest, task = parse_problem(url)
    code = Path(file_path).read_bytes()
    session = new_session()

    submit_url = f"https://atcoder.jp/contests/{contest}/submit"
    page = session.get(submit_url)
    page.raise_for_status()
    if "/login" in page.url:
        raise SystemExit("ログインしていません。bun run login を実行してください。")

    languages = languages_of(page.text)
    language_id = resolve_language(languages, query)
    csrf = re.search(r'name="csrf_token" value="([^"]+)"', page.text)
    if not csrf:
        raise SystemExit("csrf_tokenが見つかりません。ログインし直してください。")

    print(f"{task} -> {languages[language_id]} ({language_id})")
    print(f"{len(code)} bytes")
    if dry_run:
        print("dry-run のため提出しません")
        return

    response = session.post(
        submit_url,
        data={
            "csrf_token": csrf.group(1),
            "data.TaskScreenName": task,
            "data.LanguageId": language_id,
            "sourceCode": code.decode("utf-8"),
        },
    )
    response.raise_for_status()
    for message in alerts(response.text):
        print(message)
    if "/submissions/me" not in response.url:
        raise SystemExit("提出に失敗しました。連続提出の制限にかかっている可能性があります。")
    print(f"提出しました: https://atcoder.jp/contests/{contest}/submissions/me")


if __name__ == "__main__":
    main()
