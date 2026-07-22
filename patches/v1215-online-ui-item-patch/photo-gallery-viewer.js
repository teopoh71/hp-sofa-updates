(function attachPhotoGalleryViewer(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.HPPhotoGallery = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createPhotoGalleryViewer() {
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  let activeViewer = null;

  function normalizePhotos(photos) {
    const seen = new Set();
    return (Array.isArray(photos) ? photos : [])
      .map((photo) => String(photo || "").trim())
      .filter((photo) => photo && !seen.has(photo) && seen.add(photo));
  }

  function clampScale(value) {
    const number = Number(value) || MIN_SCALE;
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, number));
  }

  function moveIndex(index, delta, count) {
    if (!count) return 0;
    return Math.min(count - 1, Math.max(0, Number(index || 0) + Number(delta || 0)));
  }

  function resolveStartIndex(photos, startSrc, fallbackIndex = 0) {
    const requested = String(startSrc || "").trim();
    const found = requested ? photos.indexOf(requested) : -1;
    return found >= 0 ? found : moveIndex(fallbackIndex, 0, photos.length);
  }

  function open(options = {}) {
    if (typeof document === "undefined") return null;
    const photos = normalizePhotos(options.photos);
    if (!photos.length) return null;
    close();

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    let index = resolveStartIndex(photos, options.startSrc, options.startIndex);
    let scale = MIN_SCALE;
    let panX = 0;
    let panY = 0;
    let startX = 0;
    let startY = 0;
    let startPanX = 0;
    let startPanY = 0;
    let pinchDistance = 0;
    let pinchScale = MIN_SCALE;
    let lastTapAt = 0;
    let moved = false;
    const pointers = new Map();

    const overlay = document.createElement("div");
    overlay.className = "hp-gallery-viewer";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "图片查看");
    overlay.innerHTML = `
      <div class="hp-gallery-toolbar">
        <button class="hp-gallery-icon hp-gallery-close" type="button" aria-label="关闭">&times;</button>
        <span class="hp-gallery-counter" aria-live="polite"></span>
      </div>
      <div class="hp-gallery-stage">
        <img class="hp-gallery-image" alt="" draggable="false">
      </div>
      <button class="hp-gallery-icon hp-gallery-prev" type="button" aria-label="上一张">&lsaquo;</button>
      <button class="hp-gallery-icon hp-gallery-next" type="button" aria-label="下一张">&rsaquo;</button>
    `;

    const stage = overlay.querySelector(".hp-gallery-stage");
    const image = overlay.querySelector(".hp-gallery-image");
    const counter = overlay.querySelector(".hp-gallery-counter");
    const closeButton = overlay.querySelector(".hp-gallery-close");
    const previousButton = overlay.querySelector(".hp-gallery-prev");
    const nextButton = overlay.querySelector(".hp-gallery-next");

    function clampPan() {
      if (scale <= MIN_SCALE) {
        panX = 0;
        panY = 0;
        return;
      }
      const maxX = Math.max(0, image.clientWidth * (scale - 1) / 2);
      const maxY = Math.max(0, image.clientHeight * (scale - 1) / 2);
      panX = Math.min(maxX, Math.max(-maxX, panX));
      panY = Math.min(maxY, Math.max(-maxY, panY));
    }

    function applyTransform(animate = false) {
      clampPan();
      image.classList.toggle("is-animating", animate);
      image.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
    }

    function resetZoom(animate = false) {
      scale = MIN_SCALE;
      panX = 0;
      panY = 0;
      applyTransform(animate);
    }

    function preloadNeighbors() {
      [photos[index - 1], photos[index + 1]].filter(Boolean).forEach((src) => {
        const preload = new Image();
        preload.src = src;
      });
    }

    function showPhoto(nextIndex) {
      index = moveIndex(nextIndex, 0, photos.length);
      resetZoom(false);
      image.classList.add("is-changing");
      image.src = photos[index];
      counter.textContent = `${index + 1} / ${photos.length}`;
      previousButton.disabled = index === 0;
      nextButton.disabled = index === photos.length - 1;
      window.requestAnimationFrame(() => image.classList.remove("is-changing"));
      preloadNeighbors();
    }

    function changePhoto(delta) {
      const nextIndex = moveIndex(index, delta, photos.length);
      if (nextIndex !== index) showPhoto(nextIndex);
    }

    function toggleZoom(clientX, clientY) {
      if (scale > MIN_SCALE) {
        resetZoom(true);
        return;
      }
      scale = 2.5;
      const rect = stage.getBoundingClientRect();
      panX = (rect.left + rect.width / 2 - clientX) * 0.35;
      panY = (rect.top + rect.height / 2 - clientY) * 0.35;
      applyTransform(true);
    }

    function pointerDistance() {
      const points = [...pointers.values()];
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    function onPointerDown(event) {
      stage.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      moved = false;
      if (pointers.size === 1) {
        startX = event.clientX;
        startY = event.clientY;
        startPanX = panX;
        startPanY = panY;
      } else if (pointers.size === 2) {
        pinchDistance = pointerDistance();
        pinchScale = scale;
      }
      image.classList.remove("is-animating");
    }

    function onPointerMove(event) {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const distance = pointerDistance();
        if (pinchDistance) scale = clampScale(pinchScale * distance / pinchDistance);
        moved = true;
        applyTransform(false);
        return;
      }
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      moved = moved || Math.abs(dx) > 6 || Math.abs(dy) > 6;
      if (scale > MIN_SCALE) {
        panX = startPanX + dx;
        panY = startPanY + dy;
        applyTransform(false);
      } else {
        image.style.transform = `translate3d(${dx * 0.42}px, 0, 0) scale(1)`;
      }
    }

    function onPointerUp(event) {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      pointers.delete(event.pointerId);
      if (pointers.size) return;
      if (scale <= MIN_SCALE) {
        resetZoom(true);
        if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.2) {
          changePhoto(dx < 0 ? 1 : -1);
          return;
        }
      } else {
        applyTransform(true);
      }
      if (!moved && event.pointerType !== "mouse") {
        const now = Date.now();
        if (now - lastTapAt < 300) {
          toggleZoom(event.clientX, event.clientY);
          lastTapAt = 0;
        } else {
          lastTapAt = now;
        }
      }
    }

    function onKeyDown(event) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft" && scale === MIN_SCALE) changePhoto(-1);
      if (event.key === "ArrowRight" && scale === MIN_SCALE) changePhoto(1);
    }

    function destroy() {
      window.removeEventListener("keydown", onKeyDown);
      overlay.remove();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.({ preventScroll: true });
      if (activeViewer?.overlay === overlay) activeViewer = null;
    }

    closeButton.addEventListener("click", destroy);
    previousButton.addEventListener("click", () => changePhoto(-1));
    nextButton.addEventListener("click", () => changePhoto(1));
    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("dblclick", (event) => toggleZoom(event.clientX, event.clientY));
    stage.addEventListener("wheel", (event) => {
      event.preventDefault();
      scale = clampScale(scale + (event.deltaY < 0 ? 0.35 : -0.35));
      applyTransform(true);
    }, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    document.body.style.overflow = "hidden";
    document.body.append(overlay);
    activeViewer = { overlay, close: destroy };
    showPhoto(index);
    closeButton.focus({ preventScroll: true });
    return activeViewer;
  }

  function close() {
    activeViewer?.close?.();
  }

  return { open, close, normalizePhotos, clampScale, moveIndex, resolveStartIndex };
});
