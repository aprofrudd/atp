// shared/tooltip.js — Reusable glossary tooltip system

export class TooltipManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} glossary — { id: { title, body } }
   * @param {Function} getHitRegions — () => [{ id, cursor, test(mx,my) }]
   * @param {Function} [resolveHitId] — (region) => glossaryKey
   */
  constructor(canvas, glossary, getHitRegions, resolveHitId) {
    this.canvas = canvas;
    this.glossary = glossary;
    this.getHitRegions = getHitRegions;
    this.resolveHitId = resolveHitId || (r => r.id);
    this.activeTooltipId = null;
    this.lastCursor = 'default';

    this._ensureTooltipDOM();
    this._bindEvents();
  }

  _ensureTooltipDOM() {
    const wrap = this.canvas.parentElement;
    let tooltip = wrap.querySelector('#tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'tooltip';
      tooltip.innerHTML = `
        <button class="tooltip-close">&times;</button>
        <div class="tooltip-title"></div>
        <div class="tooltip-body"></div>
        <div class="tooltip-hint">Click anywhere to close</div>
      `;
      wrap.appendChild(tooltip);
    }
    this.tooltipEl = tooltip;
    this.tooltipEl.querySelector('.tooltip-close').addEventListener('click', () => this.hide());
  }

  _bindEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this._handlePointer(e.clientX - rect.left, e.clientY - rect.top);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this._handlePointer(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const regions = this.getHitRegions();
      let cursor = 'default';
      for (const region of regions) {
        if (region.test(mx, my)) {
          if (region.cursor) cursor = 'pointer';
          break;
        }
      }
      if (cursor !== this.lastCursor) {
        this.canvas.style.cursor = cursor;
        this.lastCursor = cursor;
      }
    });
  }

  _handlePointer(mx, my) {
    const regions = this.getHitRegions();
    for (const region of regions) {
      if (region.test(mx, my)) {
        const id = this.resolveHitId(region);
        if (this.activeTooltipId === id) {
          this.hide();
        } else {
          this.show(id, mx, my);
        }
        return;
      }
    }
    this.hide();
  }

  show(id, mx, my) {
    const entry = this.glossary[id];
    if (!entry) return;

    this.tooltipEl.querySelector('.tooltip-title').textContent = entry.title;
    this.tooltipEl.querySelector('.tooltip-body').innerHTML = entry.body;
    this.tooltipEl.classList.add('visible');

    const wrap = this.canvas.parentElement;
    const wrapRect = wrap.getBoundingClientRect();

    // Measure off-screen
    this.tooltipEl.style.left = '0px';
    this.tooltipEl.style.top = '0px';
    const tw = this.tooltipEl.offsetWidth;
    const th = this.tooltipEl.offsetHeight;

    let left = mx + 16;
    let top = my - 10;

    if (left + tw > wrapRect.width - 8) left = mx - tw - 16;
    if (left < 8) left = 8;
    if (top + th > wrapRect.height - 8) top = wrapRect.height - th - 8;
    if (top < 8) top = 8;

    this.tooltipEl.style.left = left + 'px';
    this.tooltipEl.style.top = top + 'px';

    this.activeTooltipId = id;
  }

  hide() {
    if (this.tooltipEl) this.tooltipEl.classList.remove('visible');
    this.activeTooltipId = null;
  }
}
