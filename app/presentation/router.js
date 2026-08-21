/**
 * PBOS Router
 * Simple hash-based router for SPA navigation.
 */

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.beforeHooks = [];
    this.afterHooks = [];

    window.addEventListener("hashchange", () => this._handleRoute());
    window.addEventListener("DOMContentLoaded", () => this._handleRoute());
  }

  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  beforeEach(hook) {
    this.beforeHooks.push(hook);
  }

  afterEach(hook) {
    this.afterHooks.push(hook);
  }

  navigate(path) {
    window.location.hash = path;
  }

  getCurrentPath() {
    const hash = window.location.hash;
    return hash ? hash.slice(1) : "today";
  }

  async _handleRoute() {
    const path = this.getCurrentPath();
    const from = this.currentRoute;
    const to = path;

    for (const hook of this.beforeHooks) {
      const result = await hook(from, to);
      if (result === false) {
        window.location.hash = from || "today";
        return;
      }
    }

    if (from) {
      this._deactivateScreen(from);
    }
    this._activateScreen(to);
    this.currentRoute = to;
    this._updateNavActiveState(to);

    for (const hook of this.afterHooks) {
      hook(to);
    }
  }

  _activateScreen(route) {
    const screenEl = document.querySelector(`[data-screen="${route}"]`);
    if (screenEl) {
      screenEl.classList.add("active");
    }
    const handler = this.routes.get(route);
    if (handler) {
      handler(screenEl);
    }
  }

  _deactivateScreen(route) {
    const screenEl = document.querySelector(`[data-screen="${route}"]`);
    if (screenEl) {
      screenEl.classList.remove("active");
    }
  }

  _updateNavActiveState(route) {
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
  }
}

export const router = new Router();
export default Router;
