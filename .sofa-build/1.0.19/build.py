from __future__ import annotations

import hashlib
import json
import shutil
import tempfile
import urllib.request
import zipfile
from pathlib import Path

VERSION = "1.0.19"
OLD_URL = "https://teopoh71.github.io/hp-sofa-updates/sofa-catalog/releases/1.0.18/content.zip"
OLD_SHA256 = "51c754f66bc3ff5d3de997aacbe31d04f6de86f6354b95fb64c9f5f76620cc46"
OLD_SIZE = 73384975
ROOT = Path(__file__).resolve().parents[2]
BUILD = ROOT / ".sofa-build" / VERSION
DEST = ROOT / "sofa-catalog" / "releases" / VERSION / "content.zip"
META = BUILD / "remote-bundle-meta.json"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def download(url: str, target: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "sofa-catalog-actions-builder"})
    with urllib.request.urlopen(request, timeout=180) as response, target.open("wb") as out:
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

    source_root = BUILD / "payload"
    for source in source_root.rglob("*"):
        if source.is_file():
            relative = source.relative_to(source_root)
            target = payload / relative
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)

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
            info = zipfile.ZipInfo(relative, date_time=(2026, 10, 24, 2, 30, 0))
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
