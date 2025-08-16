// DOM manipulation utilities
export function queryDeep(root, selector) {
  // Try native first
  try {
    const el = root.querySelector(selector);
    if (el) return el;
  } catch {}

  // Traverse shadow roots
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  let node = walker.currentNode;
  while (node) {
    const sr = node.shadowRoot;
    if (sr) {
      try {
        const el = sr.querySelector(selector);
        if (el) return el;
      } catch {}
    }
    node = walker.nextNode();
  }
  return null;
}

export function escapeClassToken(token) {
  return token
    .replace(/\\\\/g, "\\\\\\\\")
    .replace(/\//g, "\\/")
    .replace(/:/g, "\\:");
}

export function selectByHeuristics(root, sel) {
  const direct = queryDeep(root, sel);
  if (direct) return direct;

  const tokens = sel.trim().split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && !/[#>\[\.]/.test(sel)) {
    const classSelector = tokens.map((t) => "." + escapeClassToken(t)).join("");
    const deep = queryDeep(root, classSelector);
    if (deep) return deep;

    // Fallback: contains all class tokens
    const all = root.querySelectorAll("*");
    for (const node of all) {
      const clsAttr = node.getAttribute && (node.getAttribute("class") || "");
      const cls = clsAttr.split(/\s+/);
      if (tokens.every((t) => cls.includes(t))) return node;

      const sr = node.shadowRoot;
      if (sr) {
        const deepAll = sr.querySelectorAll("*");
        for (const sub of deepAll) {
          const subCls = (sub.getAttribute("class") || "").split(/\s+/);
          if (tokens.every((t) => subCls.includes(t))) return sub;
        }
      }
    }
  }
  return null;
}

export function scrollIntoViewSafely(element) {
  try {
    element.scrollIntoView({ block: "center", inline: "center" });
  } catch (e) {
    console.warn("Failed to scroll element into view:", e);
  }
}

export function createMouseEvent(eventType, element, options = {}) {
  const rect = element.getBoundingClientRect();
  const cx = Math.max(0, Math.floor(rect.left + rect.width / 2));
  const cy = Math.max(0, Math.floor(rect.top + rect.height / 2));

  return new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: cx,
    clientY: cy,
    ...options,
  });
}

export function createKeyboardEvent(eventType, key, options = {}) {
  return new KeyboardEvent(eventType, {
    bubbles: true,
    cancelable: true,
    key: key,
    ...options,
  });
}

export async function waitForCondition(
  condition,
  timeout = 5000,
  interval = 100
) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition();
      if (result) return result;
    } catch (e) {
      // Continue waiting
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}
