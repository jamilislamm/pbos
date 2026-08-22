/**
 * ProjectsScreen
 * Displays all Projects with their Next Actions.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §21
 */

import { NextActionCard } from "../components/NextActionCard.js";

export class ProjectsScreen {
  constructor(deps) {
    this.deps = deps;
    this.element = null;
  }

  async render() {
    const screen = document.createElement("div");
    screen.className = "projects-screen";

    const header = document.createElement("div");
    header.className = "screen-header";
    header.innerHTML = `
      <h1>Projects</h1>
      <button class="btn btn-primary" id="btn-create-project">+ New Project</button>
    `;

    const list = document.createElement("div");
    list.className = "projects-list";
    list.id = "projects-list";

    const projects = await this.deps.projectRepository.findAll();

    for (const project of projects) {
      const nextActions = await this.deps.nextActionRepository.findByProjectId(
        project.id,
      );
      const projectCard = this._renderProjectCard(project, nextActions);
      list.appendChild(projectCard);
    }

    if (projects.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <h2>No Projects Yet</h2>
          <p>Create your first project to start making progress.</p>
        </div>
      `;
    }

    screen.appendChild(header);
    screen.appendChild(list);

    const createBtn = header.querySelector("#btn-create-project");
    if (createBtn) {
      createBtn.addEventListener("click", () => this._showCreateProjectModal());
    }

    this.element = screen;
    return screen;
  }

  _renderProjectCard(project, nextActions) {
    const card = document.createElement("div");
    card.className = "card project-card";
    card.dataset.projectId = project.id;

    const statusColors = {
      planned: "primary",
      active: "success",
      paused: "warning",
      completed: "success",
      archived: "danger",
    };

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerHTML = `
      <div>
        <span class="card-title">${project.title}</span>
        <span class="badge badge-${statusColors[project.status] || "primary"}">${project.status}</span>
      </div>
      <a href="#project/${project.id}" class="btn btn-ghost btn-sm">View →</a>
    `;

    const body = document.createElement("div");
    body.className = "card-body";
    if (project.description) {
      body.textContent = project.description;
    }

    const nextActionsSection = document.createElement("div");
    nextActionsSection.className = "project-next-actions";
    nextActionsSection.innerHTML = "<h4>Next Actions</h4>";

    const executableActions = nextActions.filter(
      (na) => na.status === "available" || na.status === "active",
    );
    if (executableActions.length > 0) {
      for (const na of executableActions) {
        const naCard = new NextActionCard({
          nextAction: na,
          onStart: (id) => this._handleStartNextAction(id),
          onComplete: (id) => this._handleCompleteNextAction(id),
          onDefer: (id) => this._handleDeferNextAction(id),
          onBlock: (id) => this._handleBlockNextAction(id),
        });
        nextActionsSection.appendChild(naCard.render());
      }
    } else {
      nextActionsSection.innerHTML +=
        '<p class="text-muted">No actionable next actions.</p>';
    }

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(nextActionsSection);

    return card;
  }

  async _handleStartNextAction(nextActionId) {
    try {
      // TODO: Start Next Action Session (Phase 5)
      console.log("[ProjectsScreen] Start Next Action:", nextActionId);
      alert("Next Action Session will be implemented in Phase 5");
    } catch (err) {
      console.error("[ProjectsScreen] Failed to start Next Action:", err);
      alert(err.message);
    }
  }

  async _handleCompleteNextAction(nextActionId) {
    try {
      const { completeNextAction } =
        await import("../../application/commands/CompleteNextAction.js");
      await completeNextAction(this.deps, { nextActionId });
      // Re-render
      if (this.element) {
        const newContent = await this.render();
        this.element.replaceWith(newContent);
        this.element = newContent;
      }
    } catch (err) {
      console.error("[ProjectsScreen] Failed to complete Next Action:", err);
      alert(err.message);
    }
  }

  async _handleDeferNextAction(nextActionId) {
    try {
      const { deferNextAction } =
        await import("../../application/commands/DeferNextAction.js");
      await deferNextAction(this.deps, { nextActionId });
      if (this.element) {
        const newContent = await this.render();
        this.element.replaceWith(newContent);
        this.element = newContent;
      }
    } catch (err) {
      console.error("[ProjectsScreen] Failed to defer Next Action:", err);
      alert(err.message);
    }
  }

  async _handleBlockNextAction(nextActionId) {
    try {
      const { blockNextAction } =
        await import("../../application/commands/BlockNextAction.js");
      await blockNextAction(this.deps, { nextActionId });
      if (this.element) {
        const newContent = await this.render();
        this.element.replaceWith(newContent);
        this.element = newContent;
      }
    } catch (err) {
      console.error("[ProjectsScreen] Failed to block Next Action:", err);
      alert(err.message);
    }
  }

  _showCreateProjectModal() {
    console.log("[ProjectsScreen] Create project modal - TODO");
  }
}
