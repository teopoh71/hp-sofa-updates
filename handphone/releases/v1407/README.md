# Handphone v1407

This is the Handphone company app (`com.hp.sofabuilder`), versionCode 1407. Install over the existing app; do not uninstall.

The exact v1405 APK is the immutable base. Six web asset overrides repair the update banner, patch commit/activation, and lightweight cache-worker bootstrap. All 5,628 unrelated APK entries remain byte-identical. Signing certificate is unchanged.

15 browser checks cover responsive button visibility, successful patch activation, restart/offline retention, cart preservation, price total, and rejected corrupted download. Five migration checks cover the v1405 cache worker, saved cart and settings. Physical Android installation was not performed because no phone was connected.

Future UI patches: publish immutable, SHA-256 checked assets and increase `handphone/patch.json` patchVersionCode above 1407. Use minAppVersionCode 1407. Stable targets are `hp-live-total-v1407.js` and `hp-premium-v1407.css`; HTML/app.js may also be patched by the v1407 worker. Native changes require a new signed APK. Keep this release folder immutable.
