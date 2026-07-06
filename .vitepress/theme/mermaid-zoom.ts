// Attaches a "全屏查看" button to every rendered .mermaid container and
// opens a lightweight full-screen viewer with wheel-zoom + drag-pan +
// keyboard shortcuts (Esc close, +/− zoom, 0/R reset). Fully client-only.

const READY_ATTR = 'data-zoom-ready';

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let t: number | undefined;
  return ((...args: any[]) => {
    if (t !== undefined) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  }) as T;
}

function decorateAll() {
  const nodes = document.querySelectorAll<HTMLElement>('.mermaid');
  nodes.forEach(decorate);
}

function decorate(el: HTMLElement) {
  if (el.getAttribute(READY_ATTR) === '1') return;
  const svg = el.querySelector('svg');
  if (!svg) return; // not hydrated yet — MutationObserver will retry
  el.setAttribute(READY_ATTR, '1');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mermaid-zoom-btn';
  btn.setAttribute('aria-label', '全屏查看流程图');
  btn.title = '全屏查看（可缩放、拖动）';
  btn.innerHTML = '<span aria-hidden="true">⛶</span><span class="mermaid-zoom-btn-label">全屏</span>';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openViewer(svg as SVGElement);
  });
  el.appendChild(btn);
}

function openViewer(sourceSvg: SVGElement) {
  const overlay = document.createElement('div');
  overlay.className = 'mermaid-viewer-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '流程图全屏查看');

  const toolbar = document.createElement('div');
  toolbar.className = 'mermaid-viewer-toolbar';
  toolbar.innerHTML = [
    '<button type="button" data-action="zoom-in" title="放大 (+)" aria-label="放大">＋</button>',
    '<button type="button" data-action="zoom-out" title="缩小 (−)" aria-label="缩小">－</button>',
    '<button type="button" data-action="reset" title="重置 (0 / R)" aria-label="重置">↺</button>',
    '<button type="button" data-action="close" title="关闭 (Esc)" aria-label="关闭">✕</button>',
  ].join('');

  const hint = document.createElement('div');
  hint.className = 'mermaid-viewer-hint';
  hint.textContent = '滚轮缩放 · 拖拽平移 · Esc 关闭';

  const canvas = document.createElement('div');
  canvas.className = 'mermaid-viewer-canvas';

  const stage = document.createElement('div');
  stage.className = 'mermaid-viewer-stage';

  const clone = sourceSvg.cloneNode(true) as SVGElement;
  // strip inline height/width caps so the viewer can size the SVG freely
  clone.removeAttribute('style');
  clone.style.maxWidth = 'none';
  clone.style.maxHeight = 'none';
  clone.style.width = 'auto';
  clone.style.height = 'auto';
  stage.appendChild(clone);
  canvas.appendChild(stage);

  overlay.appendChild(canvas);
  overlay.appendChild(toolbar);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);
  document.body.classList.add('mermaid-viewer-open');

  let scale = 1;
  let tx = 0;
  let ty = 0;
  const apply = () => {
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  };
  apply();

  // Fit-to-viewport on open: scale the SVG so its natural size fits with padding.
  requestAnimationFrame(() => {
    const bbox = clone.getBoundingClientRect();
    const pad = 64;
    const availW = window.innerWidth - pad * 2;
    const availH = window.innerHeight - pad * 2;
    if (bbox.width > 0 && bbox.height > 0) {
      const s = Math.min(availW / bbox.width, availH / bbox.height, 1.5);
      scale = Math.max(0.3, s);
      apply();
    }
  });

  const clamp = (v: number) => Math.max(0.15, Math.min(8, v));

  const zoomAt = (factor: number, cx?: number, cy?: number) => {
    const next = clamp(scale * factor);
    if (cx !== undefined && cy !== undefined) {
      const rect = canvas.getBoundingClientRect();
      const px = cx - rect.left - rect.width / 2;
      const py = cy - rect.top - rect.height / 2;
      // keep the pointed-at world point stationary under the cursor
      tx = px - (px - tx) * (next / scale);
      ty = py - (py - ty) * (next / scale);
    }
    scale = next;
    apply();
  };

  const reset = () => {
    scale = 1;
    tx = 0;
    ty = 0;
    apply();
  };

  const close = () => {
    document.removeEventListener('keydown', onKey);
    document.body.classList.remove('mermaid-viewer-open');
    overlay.remove();
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.exp(delta * 0.0015);
    zoomAt(factor, e.clientX, e.clientY);
  };
  canvas.addEventListener('wheel', onWheel, { passive: false });

  let dragging = false;
  let sx = 0;
  let sy = 0;
  let ox = 0;
  let oy = 0;
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true;
    sx = e.clientX;
    sy = e.clientY;
    ox = tx;
    oy = ty;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-dragging');
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    tx = ox + (e.clientX - sx);
    ty = oy + (e.clientY - sy);
    apply();
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    canvas.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  toolbar.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!target) return;
    e.preventDefault();
    switch (target.dataset.action) {
      case 'zoom-in':
        zoomAt(1.25);
        break;
      case 'zoom-out':
        zoomAt(0.8);
        break;
      case 'reset':
        reset();
        break;
      case 'close':
        close();
        break;
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomAt(1.25); return; }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomAt(0.8); return; }
    if (e.key === '0' || e.key.toLowerCase() === 'r') { e.preventDefault(); reset(); return; }
  };
  document.addEventListener('keydown', onKey);
}

export function setupMermaidZoom() {
  if (typeof window === 'undefined') return;
  const app = document.getElementById('app') || document.body;
  const run = debounce(decorateAll, 60);
  const observer = new MutationObserver(run);
  observer.observe(app, { childList: true, subtree: true });
  decorateAll();
}
