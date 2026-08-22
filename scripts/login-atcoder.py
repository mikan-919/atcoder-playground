#!/usr/bin/env python3

import getpass
import os
import subprocess
from http.cookiejar import Cookie, LoadError, LWPCookieJar, MozillaCookieJar
from pathlib import Path


def cookie_path() -> Path:
    data_home = Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share"))
    return data_home / "online-judge-tools" / "cookie.jar"


def load_cookie_jar(path: Path) -> LWPCookieJar:
    jar = LWPCookieJar(path)
    if not path.exists():
        return jar

    try:
        jar.load(ignore_discard=True, ignore_expires=True)
        return jar
    except (LoadError, OSError):
        # 以前のヘルパーが生成したNetscape形式をSet-Cookie3形式へ移行する。
        legacy = MozillaCookieJar(path)
        try:
            legacy.load(ignore_discard=True, ignore_expires=True)
        except (LoadError, OSError):
            return jar
        for cookie in legacy:
            jar.set_cookie(cookie)
        return jar


def main() -> None:
    print("ブラウザでAtCoderへログインし、開発者ツールからREVEL_SESSIONの値を取得してください。")
    revel_session = getpass.getpass("REVEL_SESSION（入力は表示されません）: ").strip()
    if not revel_session:
        raise SystemExit("REVEL_SESSIONが空です。")

    path = cookie_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    jar = load_cookie_jar(path)

    for domain in ("atcoder.jp", ".atcoder.jp"):
        try:
            jar.clear(domain, "/", "REVEL_SESSION")
        except KeyError:
            pass

    jar.set_cookie(
        Cookie(
            version=0,
            name="REVEL_SESSION",
            value=revel_session,
            port=None,
            port_specified=False,
            domain=".atcoder.jp",
            domain_specified=True,
            domain_initial_dot=True,
            path="/",
            path_specified=True,
            secure=True,
            expires=None,
            discard=True,
            comment=None,
            comment_url=None,
            rest={"HttpOnly": None},
            rfc2109=False,
        )
    )
    jar.save(ignore_discard=True, ignore_expires=True)
    path.chmod(0o600)

    print(f"cookieを保存しました: {path}")
    result = subprocess.run(["oj", "login", "--check", "https://atcoder.jp/"], check=False)
    if result.returncode != 0:
        raise SystemExit("ログイン確認に失敗しました。REVEL_SESSIONを取り直してください。")


if __name__ == "__main__":
    main()
