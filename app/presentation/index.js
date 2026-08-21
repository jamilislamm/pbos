/**
 * PBOS App Bootstrap
 * Phase 0 - Foundation. No business logic yet.
 */

import { router } from "./router.js";

const screens = {
  today: { title: "Today", id: "screen-today" },
  habits: { title: "Habits", id: "screen-habits" },
  projects: { title: "Projects", id: "screen-projects" },
  mindmap: { title: "Mind Map", id: "screen-mindmap" },
  insights: { title: "Insights", id: "screen-insights" },
};

const appState = {
  initialized: false,
  currentScreen: null,
};

function init() {
  console.log("[PBOS] Initializing...");
  buildScreens();
  initNavigation();
  initRouter();
  appState.initialized = true;
  console.log("[PBOS] Initialized. Current route:", router.getCurrentPath());
}

function buildScreens() {
  const container = document.getElementById("screen-container");
  if (!container) {
    console.error("[PBOS] screen-container not found");
    return;
  }
  container.innerHTML = "";

  for (const [route, config] of Object.entries(screens)) {
    const screenEl = document.createElement("div");
    screenEl.className = "screen";
    screenEl.dataset.screen = route;
    screenEl.id = config.id;

    screenEl.innerHTML = `
      <div class="empty-state">
        <h2>${config.title}</h2>
        <p>This screen will be implemented in a later phase.</p>
        <span class="badge badge-primary">Phase 0 Placeholder</span>
      </div>
    `;

    container.appendChild(screenEl);
    router.register(route, (el) => {
      appState.currentScreen = route;
      document.title = `${config.title} - PBOS`;
    });
  }
}

function initNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

function initRouter() {
  if (!window.location.hash) {
    window.location.hash = "today";
  }
}

export function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "opacity 250ms ease, transform 250ms ease";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

export function openModal(contentHTML) {
  const container = document.getElementById("modal-container");
  const content = document.getElementById("modal-content");
  if (!container || !content) return;

  content.innerHTML = contentHTML;
  container.classList.add("open");
  container.setAttribute("aria-hidden", "false");
  container.querySelector(".modal-backdrop").onclick = closeModal;
}

export function closeModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;
  container.classList.remove("open");
  container.setAttribute("aria-hidden", "true");
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

init();
