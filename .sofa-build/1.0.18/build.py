from __future__ import annotations

import hashlib
import json
import shutil
import tempfile
import urllib.request
import zipfile
from pathlib import Path

VERSION = "1.0.18"
OLD_URL = "https://teopoh71.github.io/hp-sofa-updates/sofa-catalog/releases/1.0.17/content.zip"
OLD_SHA256 = "5d5e3706d516680ee892889d4b4d2b86921255eb90a9105b88c906854b42e45f"
OLD_SIZE = 71750217
ROOT = Path(__file__).resolve().parents[2]
BUILD = ROOT / ".sofa-build" / VERSION
DEST = ROOT / "sofa-catalog" / "releases" / VERSION / "content.zip"
META = BUILD / "remote-bundle-meta.json"
NEW_IMAGES = {
    "images/436195c11b86ffc7.jpg": (
        "https://cdfhome.com/uploads/images/20261020/caf2150735cf5712424ae252d151c078.jpg",
        "436195c11b86ffc7cb74606154ef679667d2cbba9efe2f324cb4d70749c9f337",
    ),
    "images/d8e3e0e018d91536.jpg": (
        "https://cdfhome.com/uploads/images/20261019/cd3657eeb569308d4ceac8f67ed00676.jpg",
        "d8e3e0e018d91536f69b1c9e1ada6a1660334b332aea109fe3974ac5a3ed7232",
    ),
    "images/aefb633167cde53b.jpg": (
        "https://cdfhome.com/uploads/images/20261019/0f3123b8cc509e9d80255f802bb98439.jpg",
        "aefb633167cde53bca8d521f6b19b013564d9aa0cd0918f302de494cd599b3bc",
    ),
}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def download(url: str, target: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "sofa-catalog-actions-builder"})
    with urllib.request.urlopen(request, timeout=120) as response, target.open("wb") as out:
        shutil.copyfileobj(response, out)


with tempfile.TemporaryDirectory() as td:
    temp = Path(td)
    old_zip = temp / "old.zip"
    payload = temp / "payload"
    payload.mkdir()
    download(OLD_URL, old_zip)
    if old_zip.stat().st_size != OLD_SIZE or sha256(old_zip) != OLD_SHA256:
        raise SystemExit("previous public bundle failed size/SHA-256 verification")

    with zipfile.ZipFile(old_zip, "r") as archive:
        for info in archive.infolist():
            path = Path(info.filename)
            if path.is_absolute() or ".." in path.parts:
                raise SystemExit(f"unsafe archive member: {info.filename}")
        archive.extractall(payload)

    shutil.copyfile(BUILD / "data.js", payload / "data.js")
    shutil.copyfile(BUILD / "index.html", payload / "index.html")

    for relative, (url, expected_sha) in NEW_IMAGES.items():
        target = payload / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        download(url, target)
        if sha256(target) != expected_sha:
            raise SystemExit(f"official image SHA-256 mismatch: {relative}")

    manifest = json.loads((BUILD / "manifest.json").read_text(encoding="utf-8"))
    expected = {entry["path"]: entry for entry in manifest["files"]}
    actual = {
        p.relative_to(payload).as_posix(): p
        for p in payload.rglob("*")
        if p.is_file()
    }
    if set(actual) != set(expected):
        missing = sorted(set(expected) - set(actual))
        extra = sorted(set(actual) - set(expected))
        raise SystemExit(f"content file-set mismatch missing={missing} extra={extra}")

    for relative, entry in expected.items():
        path = actual[relative]
        if path.stat().st_size != entry["size"] or sha256(path) != entry["sha256"]:
            raise SystemExit(f"content verification mismatch: {relative}")

    DEST.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(
        DEST,
        "w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
        allowZip64=True,
    ) as archive:
        for relative in sorted(actual):
            data = actual[relative].read_bytes()
            info = zipfile.ZipInfo(relative, date_time=(2026, 10, 22, 2, 30, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

    result = {
        "version": VERSION,
        "sha256": sha256(DEST),
        "size": DEST.stat().st_size,
        "uncompressedSize": sum(entry["size"] for entry in manifest["files"]),
        "files": len(manifest["files"]),
        "dataSha256": expected["data.js"]["sha256"],
        "indexSha256": expected["index.html"]["sha256"],
    }
    META.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False))
