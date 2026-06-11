# HP Sofa MatePad Updates

This repository is for online MatePad APK updates.

GitHub Pages URL pattern:

```text
https://teopoh71.github.io/hp-sofa-updates/update.json
```

Use this repo for:

- `update.json`: the small version file the installed app checks.
- APK release links: upload APKs to GitHub Releases, then paste the APK download URL into `update.json`.

## First setup

1. Create a public GitHub repository named `hp-sofa-updates` under `teopoh71`.
2. Upload these files to the repo root:
   - `README.md`
   - `update.json`
   - `.nojekyll`
3. In GitHub, open **Settings -> Pages**.
4. Set **Source** to `Deploy from a branch`.
5. Set branch to `main` and folder to `/root`.
6. Save.

## Later update flow

1. Build the new APK with the same package name and signing key.
2. Create a GitHub Release, for example `v84`.
3. Upload the APK file to that release.
4. Copy the APK download URL.
5. Edit `update.json`:
   - increase `versionCode`
   - change `versionName`
   - paste the APK URL into `apkUrl`
6. The installed MatePad app will show the update button after it sees the higher `versionCode`.

## Important

Android can only install an update over the old app when:

- package name is the same
- signing key is the same
- new `versionCode` is higher
