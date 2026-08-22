/**
 * PBOS App Bootstrap
 * Robust version with lazy loading and error handling.
 */

import { router } from "./router.js";

// ===== Lazy-loaded module cache =====
let _modules = null;

async function loadModules() {
  if (_modules) return _modules;

  const [
    { indexedDBAdapter },
    { IndexedDBHabitRepository },
    { IndexedDBHabitExecutionRepository },
    { IndexedDBSessionRepository },
    { IndexedDBNextActionRepository },
    { IndexedDBProjectRepository },
    { IndexedDBGoalRepository },
    { IndexedDBLifeDomainRepository },
    { IndexedDBReflectionRepository },
    { IndexedDBRecoveryRepository },
    { IndexedDBRoadmapRepository },
    { IndexedDBNodeRepository },
    { systemClock },
    { uuidGenerator },
  ] = await Promise.all([
    import("../infrastructure/persistence/indexeddb/IndexedDBAdapter.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBHabitRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBHabitExecutionRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBSessionRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBNextActionRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBProjectRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBGoalRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBLifeDomainRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBReflectionRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBRecoveryRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBRoadmapRepository.js"),
    import("../infrastructure/persistence/indexeddb/IndexedDBNodeRepository.js"),
    import("../infrastructure/time/SystemClock.js"),
    import("../infrastructure/identity/UUIDGenerator.js"),
  ]);

  _modules = {
    indexedDBAdapter,
    habitRepository: new IndexedDBHabitRepository(),
    habitExecutionRepository: new IndexedDBHabitExecutionRepository(),
    sessionRepository: new IndexedDBSessionRepository(),
    nextActionRepository: new IndexedDBNextActionRepository(),
    projectRepository: new IndexedDBProjectRepository(),
    goalRepository: new IndexedDBGoalRepository(),
    lifeDomainRepository: new IndexedDBLifeDomainRepository(),
    reflectionRepository: new IndexedDBReflectionRepository(),
    recoveryRepository: new IndexedDBRecoveryRepository(),
    roadmapRepository: new IndexedDBRoadmapRepository(),
    nodeRepository: new IndexedDBNodeRepository(),
    systemClock,
    uuidGenerator,
  };

  return _modules;
}

// ===== App Context (built after module load) =====
let appContext = null;

// ===== Screen cache =====
const screenInstances = {};
let screensBuilt = false;

// ===== Build Screens =====
async function buildScreens() {
  if (screensBuilt) return;
  screensBuilt = true;

  const container = document.getElementById("screen-container");
  if (!container) {
    console.error("[PBOS] screen-container not found");
    return;
  }
  container.innerHTML = "";

  // --- Today Screen ---
  const todayEl = createPlaceholderScreen("today", "Today", "Phase 6");
  container.appendChild(todayEl);
  router.register("today", () => {
    document.title = "Today - PBOS";
  });

  // --- Habits Screen (REAL) ---
  const habitsEl = document.createElement("div");
  habitsEl.className = "screen";
  habitsEl.dataset.screen = "habits";
  habitsEl.id = "screen-habits";
  container.appendChild(habitsEl);

  router.register("habits", async () => {
    document.title = "Habits - PBOS";
    habitsEl.innerHTML =
      '<div class="loading-state"><p>Loading habits...</p></div>';

    try {
      const { HabitsScreen } = await import("./screens/HabitsScreen.js");
      if (!screenInstances.habits) {
        screenInstances.habits = new HabitsScreen(appContext);
      }
      habitsEl.innerHTML = "";
      const content = await screenInstances.habits.render();
      habitsEl.appendChild(content);
    } catch (err) {
      console.error("[PBOS] Failed to load Habits screen:", err);
      habitsEl.innerHTML = `
        <div class="empty-state">
          <h2>Error Loading Habits</h2>
          <p>${err.message}</p>
          <button class="btn btn-secondary" onclick="window.location.reload()">Reload</button>
        </div>
      `;
    }
  });

  // --- Habit Detail Screen (REAL) ---
  const habitDetailEl = document.createElement("div");
  habitDetailEl.className = "screen";
  habitDetailEl.dataset.screen = "habit-detail";
  habitDetailEl.id = "screen-habit-detail";
  container.appendChild(habitDetailEl);

  // --- Projects Screen (REAL) ---
  const projectsEl = document.createElement("div");
  projectsEl.className = "screen";
  projectsEl.dataset.screen = "projects";
  projectsEl.id = "screen-projects";
  container.appendChild(projectsEl);

  router.register("projects", async () => {
    document.title = "Projects - PBOS";
    projectsEl.innerHTML =
      '<div class="loading-state"><p>Loading projects...</p></div>';

    try {
      const { ProjectsScreen } = await import("./screens/ProjectsScreen.js");
      if (!screenInstances.projects) {
        screenInstances.projects = new ProjectsScreen(appContext);
      }
      projectsEl.innerHTML = "";
      const content = await screenInstances.projects.render();
      projectsEl.appendChild(content);
    } catch (err) {
      console.error("[PBOS] Failed to load Projects screen:", err);
      projectsEl.innerHTML = `
        <div class="empty-state">
          <h2>Error Loading Projects</h2>
          <p>${err.message}</p>
          <button class="btn btn-secondary" onclick="window.location.reload()">Reload</button>
        </div>
      `;
    }
  });

  // --- Project Detail Screen (REAL) ---
  const projectDetailEl = document.createElement("div");
  projectDetailEl.className = "screen";
  projectDetailEl.dataset.screen = "project-detail";
  projectDetailEl.id = "screen-project-detail";
  container.appendChild(projectDetailEl);

  // Dynamic route: #project/{id}

  // --- Mind Map Screen ---
  const mindmapEl = createPlaceholderScreen("mindmap", "Mind Map", "Phase 9");
  container.appendChild(mindmapEl);
  router.register("mindmap", () => {
    document.title = "Mind Map - PBOS";
  });

  // --- Insights Screen ---
  const insightsEl = createPlaceholderScreen(
    "insights",
    "Insights",
    "Phase 10",
  );
  container.appendChild(insightsEl);
  router.register("insights", () => {
    document.title = "Insights - PBOS";
  });

  // --- Session Screen ---
  const sessionEl = createPlaceholderScreen("session", "Session", "Phase 5");
  container.appendChild(sessionEl);
  router.register("session", () => {
    document.title = "Session - PBOS";
  });

  // Dynamic route handler
  window.addEventListener("hashchange", handleDynamicRoutes);
  handleDynamicRoutes();
}

function createPlaceholderScreen(route, title, phase) {
  const el = document.createElement("div");
  el.className = "screen";
  el.dataset.screen = route;
  el.id = `screen-${route}`;
  el.innerHTML = `
    <div class="empty-state">
      <h2>${title}</h2>
      <p>This screen will be implemented in ${phase}.</p>
      <span class="badge badge-primary">${phase} Placeholder</span>
    </div>
  `;
  return el;
}

async function handleDynamicRoutes() {
  const hash = window.location.hash.slice(1);

  if (hash.startsWith("habit/")) {
    const habitId = hash.split("/")[1];
    if (!habitId) return;

    document
      .querySelectorAll(".screen")
      .forEach((el) => el.classList.remove("active"));

    const detailEl = document.getElementById("screen-habit-detail");
    if (!detailEl) return;

    detailEl.classList.add("active");
    detailEl.innerHTML =
      '<div class="loading-state"><p>Loading habit...</p></div>';

    try {
      const { HabitDetailScreen } =
        await import("./screens/HabitDetailScreen.js");
      if (!screenInstances.habitDetail) {
        screenInstances.habitDetail = new HabitDetailScreen(appContext);
      }
      detailEl.innerHTML = "";
      const content = await screenInstances.habitDetail.render(habitId);
      detailEl.appendChild(content);
      document.title = "Habit Detail - PBOS";
    } catch (err) {
      console.error("[PBOS] Failed to load Habit detail:", err);
      detailEl.innerHTML = `
        <div class="empty-state">
          <h2>Error</h2>
          <p>${err.message}</p>
          <a href="#habits" class="btn btn-secondary">Back to Habits</a>
        </div>
      `;
    }
  }
  // Pattern: project/{id}
  if (hash.startsWith("project/")) {
    const projectId = hash.split("/")[1];
    if (!projectId) return;

    document
      .querySelectorAll(".screen")
      .forEach((el) => el.classList.remove("active"));

    const detailEl = document.getElementById("screen-project-detail");
    if (!detailEl) return;

    detailEl.classList.add("active");
    detailEl.innerHTML =
      '<div class="loading-state"><p>Loading project...</p></div>';

    try {
      const { ProjectDetailScreen } =
        await import("./screens/ProjectDetailScreen.js");
      if (!screenInstances.projectDetail) {
        screenInstances.projectDetail = new ProjectDetailScreen(appContext);
      }
      detailEl.innerHTML = "";
      const content = await screenInstances.projectDetail.render(projectId);
      detailEl.appendChild(content);
      document.title = "Project Detail - PBOS";
    } catch (err) {
      console.error("[PBOS] Failed to load Project detail:", err);
      detailEl.innerHTML = `
        <div class="empty-state">
          <h2>Error</h2>
          <p>${err.message}</p>
          <a href="#projects" class="btn btn-secondary">Back to Projects</a>
        </div>
      `;
    }
    return;
  }
}

// ===== Navigation =====
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

// ===== Initialization =====
async function init() {
  console.log("[PBOS] Initializing...");

  try {
    // Load all modules and build context
    const mods = await loadModules();
    appContext = mods;

    // Init IndexedDB
    await mods.indexedDBAdapter.init();
    console.log("[PBOS] IndexedDB ready");

    // Build screens
    await buildScreens();

    // Init navigation
    initNavigation();

    // Set default route
    if (!window.location.hash) {
      window.location.hash = "today";
    }

    console.log("[PBOS] Ready");
  } catch (err) {
    console.error("[PBOS] Initialization failed:", err);
    const container = document.getElementById("screen-container");
    if (container) {
      container.innerHTML = `
        <div class="empty-state">
          <h2>Failed to Start PBOS</h2>
          <p>${err.message}</p>
          <p style="font-size:0.875rem;color:var(--color-text-muted);margin-top:1rem;">
            Check browser console (F12) for details.
          </p>
          <button class="btn btn-secondary" onclick="window.location.reload()" style="margin-top:1rem;">
            Retry
          </button>
        </div>
      `;
    }
  }
}

// ===== Toast =====
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

// ===== Modal =====
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

// Start
init();
