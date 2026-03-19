// shared/core.js — Reusable canvas utilities

export function lerp(a, b, t) { return a + (b - a) * t; }

export function toRad(deg) { return deg * Math.PI / 180; }

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function getInactive(pool) {
  for (const p of pool) {
    if (!p.active) return p;
  }
  return null;
}

/**
 * DPR-aware canvas setup with resize handling.
 * Returns { canvas, ctx, dpr, resize(), cssWidth, cssHeight }
 */
export function createCanvasManager(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  let dpr = 1;
  let cssW = 0;
  let cssH = 0;

  function resize() {
    const wrap = canvas.parentElement;
    dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cssW = rect.width;
    cssH = rect.height;
  }

  return {
    canvas,
    ctx,
    get dpr() { return dpr; },
    get cssWidth() { return cssW; },
    get cssHeight() { return cssH; },
    resize,
  };
}

/**
 * requestAnimationFrame loop with dt capping.
 * updateFn(dt) is called each frame, then renderFn(dt) for drawing.
 */
export function createAnimationLoop(updateFn, renderFn) {
  let lastTime = 0;

  function frame(timestamp) {
    if (!lastTime) lastTime = timestamp;
    let dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    if (dt > 0.05) dt = 0.05;

    updateFn(dt, timestamp);
    renderFn(dt, timestamp);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
