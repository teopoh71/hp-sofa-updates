window.HP_SOFA_APP_VERSION = {
  versionCode: 1095,
  versionName: "v1095-native-patch-bridge",
  updateManifestUrl: "https://teopoh71.github.io/hp-sofa-updates/update-mobile.json",
  fullDownloadUrl: "https://teopoh71.github.io/hp-sofa-updates/apks/hp-sofa-v1095-native-patch-bridge.apk",
  patchVersionCode: 1108,
  patchversionCode: 1108,
  patchVersionName: "v1108-runtime-bootstrap-fix",
  patchManifestUrl: "https://teopoh71.github.io/hp-sofa-updates/patch.json"
};
(function bootstrapPhonePatchRuntime() {
  const scripts = [
    "zolano-excel-price-overrides.js?v=v1108-runtime-bootstrap-fix",
    "zolano3792-phone-pin.js?v=v1108-runtime-bootstrap-fix",
    "nikator-half-leather-hotfix.js?v=v1108-runtime-bootstrap-fix"
  ];
  function loadScript(src) {
    if (document.querySelector(`script[data-hp-runtime-patch="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.hpRuntimePatch = src;
    (document.head || document.documentElement).appendChild(script);
  }
  function boot() {
    scripts.forEach(loadScript);
    document.documentElement.setAttribute("data-hp-runtime-bootstrap", "v1108");
  }
  if (document.head || document.documentElement) boot();
  else document.addEventListener("DOMContentLoaded", boot, { once: true });
}());
