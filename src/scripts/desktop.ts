import interact from "interactjs";
import DragSelect from "dragselect";
import { DragDropManager, KeyboardSensor } from "@dnd-kit/dom";
import { Sortable } from "@dnd-kit/dom/sortable";

type ManagedWindow = {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  opener: HTMLElement | null;
  maximized: boolean;
  previous?: { x: number; y: number; w: number; h: number };
};

type OpenOptions = {
  push?: boolean;
  announce?: boolean;
  opener?: HTMLElement | null;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

let selection: DragSelect | null = null;

function initDesktop(desktop: HTMLElement) {
  if (desktop.hasAttribute("data-desktop-ready")) return;
  desktop.setAttribute("data-desktop-ready", "");

  const host = desktop.querySelector<HTMLElement>("[data-window-host]");
  if (!host) return;

  initWindows(desktop, host);
  initIconSorting(desktop);
  initSelection(desktop);
}

function initWindows(desktop: HTMLElement, host: HTMLElement) {
  const wins = new Map<string, ManagedWindow>();
  const announcer = document.querySelector<HTMLElement>(
    "[data-window-announcer]",
  );

  desktop.querySelectorAll<HTMLElement>("[data-window]").forEach((el) => {
    const id = el.dataset.windowId;
    if (!id) return;

    wins.set(id, {
      el,
      x: Number.parseFloat(el.style.left) || 0,
      y: Number.parseFloat(el.style.top) || 0,
      w: Number.parseFloat(el.style.width) || 640,
      h: Number.parseFloat(el.style.height) || 440,
      opener: null,
      maximized: false,
    });
  });

  let stack = Array.from(wins.keys());

  const announce = (message: string) => {
    if (announcer) announcer.textContent = message;
  };

  const apply = (win: ManagedWindow) => {
    win.el.style.left = `${win.x}px`;
    win.el.style.top = `${win.y}px`;
    win.el.style.width = `${win.w}px`;
    win.el.style.height = `${win.h}px`;
  };

  const focusWindow = (id: string) => {
    stack = [...stack.filter((key) => key !== id), id];
    stack.forEach((key, index) => {
      const win = wins.get(key);
      if (!win) return;
      win.el.style.zIndex = String(10 + index);
      win.el.toggleAttribute("data-active", key === id);
    });
  };

  const windowUrl = (id: string | null) => {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("window", id);
    else url.searchParams.delete("window");
    return url;
  };

  const openWindow = (id: string, options: OpenOptions = {}) => {
    const win = wins.get(id);
    if (!win) return;

    const wasHidden = win.el.hidden;
    win.el.hidden = false;
    if (options.opener !== undefined) win.opener = options.opener;

    // Opening a window is an action, not a selection; clear the marquee
    // selection so the desktop does not stay highlighted behind the window.
    selection?.setSelection([]);

    focusWindow(id);

    if (wasHidden) {
      win.el.focus({ preventScroll: true });
      if (options.announce !== false) {
        announce(`${win.el.dataset.windowTitle ?? id} window opened`);
      }
    }

    if (options.push !== false && window.location.search !== windowUrl(id).search) {
      window.history.pushState({ window: id }, "", windowUrl(id));
    }
  };

  const closeWindow = (id: string, options: { url?: boolean } = {}) => {
    const win = wins.get(id);
    if (!win || win.el.hidden) return;

    const hadFocus = win.el.contains(document.activeElement);
    win.el.hidden = true;
    win.el.removeAttribute("data-active");

    if (hadFocus) win.opener?.focus({ preventScroll: true });

    const current = new URL(window.location.href).searchParams.get("window");
    if (options.url !== false && current === id) {
      window.history.replaceState({}, "", windowUrl(null));
    }

    announce(`${win.el.dataset.windowTitle ?? id} window closed`);
  };

  const maximizeWindow = (id: string) => {
    const win = wins.get(id);
    if (!win) return;

    if (win.maximized && win.previous) {
      Object.assign(win, win.previous);
      win.previous = undefined;
      win.maximized = false;
      win.el.removeAttribute("data-maximized");
    } else {
      win.previous = { x: win.x, y: win.y, w: win.w, h: win.h };
      win.x = 0;
      win.y = 0;
      win.w = host.clientWidth;
      win.h = host.clientHeight;
      win.maximized = true;
      win.el.setAttribute("data-maximized", "");
    }

    apply(win);
    focusWindow(id);
  };

  wins.forEach((win, id) => {
    const dragHandle = win.el.querySelector<HTMLElement>("[data-window-drag]");

    if (dragHandle) {
      interact(dragHandle).draggable({
        ignoreFrom: "a, button, input, select, textarea",
        listeners: {
          start: () => focusWindow(id),
          move: (event) => {
            if (win.maximized) return;
            const maxX = Math.max(0, host.clientWidth - win.w);
            const maxY = Math.max(0, host.clientHeight - win.h);
            win.x = clamp(win.x + event.dx, 0, maxX);
            win.y = clamp(win.y + event.dy, 0, maxY);
            apply(win);
          },
        },
      });
    }

    interact(win.el).resizable({
      edges: { top: false, left: false, bottom: true, right: true },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 280, height: 180 },
        }),
      ],
      listeners: {
        move: (event) => {
          if (win.maximized) return;
          win.w = Math.round(event.rect.width);
          win.h = Math.round(event.rect.height);
          apply(win);
        },
      },
    });

    win.el.addEventListener("pointerdown", () => focusWindow(id), {
      passive: true,
    });
    win.el.addEventListener("focusin", () => focusWindow(id));

    win.el
      .querySelectorAll<HTMLElement>("[data-window-close]")
      .forEach((button) =>
        button.addEventListener("click", () => closeWindow(id)),
      );

    win.el
      .querySelectorAll<HTMLElement>("[data-window-maximize]")
      .forEach((button) =>
        button.addEventListener("click", () => maximizeWindow(id)),
      );

    if (win.el.hasAttribute("data-open")) {
      openWindow(id, { push: false, announce: false });
    }
  });

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target as Element | null;
    const link = target?.closest<HTMLAnchorElement>("a[data-open-window]");
    const id = link?.dataset.openWindow;
    if (!link || !id || !wins.has(id)) return;

    event.preventDefault();
    openWindow(id, { opener: link });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    // Let the site menu close itself before windows react to Escape.
    if (
      document.querySelector(
        '[data-slot="dropdown-menu-content"]:not([hidden])',
      )
    ) {
      return;
    }

    const active = document.activeElement as HTMLElement | null;
    const win = active?.closest<HTMLElement>("[data-window]");
    const id = win?.dataset.windowId;
    if (!win || !id || win.hidden) return;

    event.preventDefault();
    closeWindow(id);
  });

  window.addEventListener("popstate", () => {
    const id = new URL(window.location.href).searchParams.get("window");
    wins.forEach((win, key) => {
      if (key === id) openWindow(key, { push: false, announce: false });
      else if (!win.el.hidden) closeWindow(key, { url: false });
    });
  });

  // A deep-linked window is opened during init, before the browser has settled
  // page-load focus. Re-apply it on the next frame so keyboard users land in
  // the window they asked for.
  const deepLinked = new URL(window.location.href).searchParams.get("window");
  if (deepLinked) {
    window.requestAnimationFrame(() => {
      const win = wins.get(deepLinked);
      if (!win || win.el.hidden) return;
      win.el.focus({ preventScroll: true });
      focusWindow(deepLinked);
    });
  }
}

/**
 * Icon rearrangement. `@dnd-kit/dom`'s optimistic sorting plugin moves the DOM
 * nodes during the drag, so on `dragend` the DOM already reflects the new
 * order. We only persist it.
 */
function initIconSorting(desktop: HTMLElement) {
  const grid = desktop.querySelector<HTMLElement>("[data-sortable-grid]");
  if (!grid) return;

  const storageKey = `kevan:desktop-order:${grid.dataset.sortableGrid ?? "default"}`;
  const announcer = document.querySelector<HTMLElement>(
    "[data-window-announcer]",
  );

  // Only direct children: the drag feedback plugin can briefly clone an item
  // into the DOM, and a `querySelectorAll` would count that clone too.
  const items = () =>
    Array.from(grid.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && el.hasAttribute("data-sortable-item"),
    );

  const persist = () => {
    const order = [
      ...new Set(
        items()
          .map((el) => el.dataset.iconId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(order));
    } catch {
      // Storage can be disabled; reordering still works for this session.
    }
  };

  const announce = (message: string) => {
    if (announcer) announcer.textContent = message;
  };

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "null");
    if (Array.isArray(saved)) {
      for (const iconId of saved) {
        const item = items().find((el) => el.dataset.iconId === iconId);
        if (item) grid.append(item);
      }
    }
  } catch {
    // Ignore malformed or unavailable storage; the server order still works.
  }

  // Pointer dragging via dnd-kit. The keyboard sensor is removed below and
  // replaced with the explicit arrow-key handler, which is easier to control
  // and announce than a 10px virtual drag.
  const manager = new DragDropManager({
    sensors: (defaults) => defaults.filter((sensor) => sensor !== KeyboardSensor),
  });

  items().forEach((el, index) => {
    new Sortable(
      {
        id: el.dataset.iconId ?? String(index),
        index,
        element: el,
        handle: el.querySelector<HTMLElement>("[data-sortable-handle]") ?? undefined,
        group: grid.dataset.sortableGrid ?? "icons",
      },
      manager,
    );
  });

  manager.monitor.addEventListener("dragend", (event) => {
    if (event.canceled) return;

    // Defer past dnd-kit's own cleanup so any feedback clone is gone before
    // the final order is read.
    window.setTimeout(persist, 0);
  });

  // Keyboard reordering: one grid cell per arrow key press.
  grid.addEventListener("keydown", (event) => {
    if (!(event.target instanceof Element)) return;

    const handle = event.target.closest<HTMLElement>("[data-sortable-handle]");
    if (!handle) return;

    const step =
      event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : event.key === "ArrowRight" || event.key === "ArrowDown"
          ? 1
          : 0;
    if (!step) return;

    const item = handle.closest<HTMLElement>("[data-sortable-item]");
    if (!item) return;

    const all = items();
    const target = all[all.indexOf(item) + step];
    if (!target) return;

    event.preventDefault();

    if (step < 0) grid.insertBefore(item, target);
    else grid.insertBefore(item, target.nextSibling);

    handle.focus();
    persist();

    const label =
      item.querySelector(".os-icon-label")?.textContent?.trim() ??
      item.dataset.iconId ??
      "Icon";
    announce(
      `${label} moved to position ${items().indexOf(item) + 1} of ${items().length}.`,
    );
  });
}

function initSelection(desktop: HTMLElement) {
  const area = desktop.querySelector<HTMLElement>("[data-desktop-surface]");
  if (!area) return;

  const selectables = area.querySelectorAll<HTMLElement>("[data-selectable]");
  if (!selectables.length) return;

  selection = new DragSelect({
    area,
    selectables,
    selectedClass: "is-selected",
    selectableClass: "is-selectable",
    multiSelectKeys: ["Shift", "Control", "Meta"],
    draggability: false,
    keyboardDrag: false,
  });
}

const desktop = document.querySelector<HTMLElement>("[data-desktop]");
if (desktop) initDesktop(desktop);
