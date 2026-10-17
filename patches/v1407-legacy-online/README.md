# Handphone 1406 → 1407 without installing an APK

Publish channel: root `patch.json`. The 1406 app already loads `hp-live-total-v1400.js` and `hp-premium-v1400.css` from its existing patch cache. This release replaces only those two resources (31,812 bytes). It preserves the installed APK, original app.js/index.html/app-version.js/sw.js and old cache-worker identity.

The compatibility updater initializes at DOMContentLoaded because this UI script appears before app.js in the original HTML. It reuses the active worker and original patch cache, verifies SHA-256 and sizes before committing, restores previous cache responses if a write fails, and reloads after success. It does not change native permissions, catalog/pricing logic, IndexedDB cart or saved settings.

Verification: 17 passing checks from the authentic cached 1406 UI on unchanged 1405 native web assets. The first 1407 repair and a simulated subsequent 1408 patch activate automatically, preserve cart/settings and survive offline reopening. A corrupted 1409 download is rejected and retains the working 1408 UI. No APK request or installation occurs. Physical phone interaction remains untested.

For existing 1406 users: close/reopen the app, choose 检查更新, then download the v1407 online repair. The page automatically refreshes. No uninstall, APK installation or data clearing is required. The Android installation version stays unchanged; the displayed app UI patch version becomes 1407.

Keep this folder immutable. Future compatible updates should increase root patchVersionCode and use these stable UI targets. Core files blocked by the legacy worker need a separately designed compatibility layer or a native release; do not claim they were updated through this manifest. The native 1407 APK's separate handphone/patch.json channel remains unchanged.
