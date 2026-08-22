/**
 * ProjectDetailScreen
 * Shows detailed view of a single Project.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §21
 */

import { NextActionCard } from "../components/NextActionCard.js";

export class ProjectDetailScreen {
  constructor(deps) {
    this.deps = deps;
    this.element = null;
    this.projectId = null;
  }

  async render(projectId) {
    this.projectId = projectId;

    const screen = document.createElement("div");
    screen.className = "project-detail-screen";

    const { getProject } =
      await import("../../application/queries/GetProject.js");
    const { project, nextActions } = await getProject(this.deps, { projectId });

    if (!project) {
      screen.innerHTML = `
        <div class="empty-state">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <a href="#projects" class="btn btn-secondary">Back to Projects</a>
        </div>
      `;
      this.element = screen;
      return screen;
    }

    const statusColors = {
      planned: "primary",
      active: "success",
      paused: "warning",
      completed: "success",
      archived: "danger",
    };

    const header = document.createElement("div");
    header.className = "project-detail-header";
    header.innerHTML = `
      <a href="#projects" class="btn btn-ghost btn-sm">← Back</a>
      <h1>${project.title}</h1>
      <span class="badge badge-${statusColors[project.status] || "primary"}">${project.status}</span>
      <p class="project-description">${project.description || ""}</p>
    `;

    const nextActionsSection = document.createElement("div");
    nextActionsSection.className = "card";
    nextActionsSection.innerHTML =
      '<div class="card-header"><span class="card-title">Next Actions</span></div>';

    const naBody = document.createElement("div");
    naBody.className = "card-body";

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
        naBody.appendChild(naCard.render());
      }
    } else {
      naBody.innerHTML =
        '<p class="text-muted">No actionable next actions. Create one to get started.</p>';
    }

    nextActionsSection.appendChild(naBody);

    const createNaBtn = document.createElement("button");
    createNaBtn.className = "btn btn-primary";
    createNaBtn.textContent = "+ Add Next Action";
    createNaBtn.style.marginTop = "1rem";
    createNaBtn.addEventListener("click", () =>
      this._showCreateNextActionModal(),
    );

    screen.appendChild(header);
    screen.appendChild(nextActionsSection);
    screen.appendChild(createNaBtn);

    this.element = screen;
    return screen;
  }

  async _handleStartNextAction(nextActionId) {
    console.log("[ProjectDetailScreen] Start Next Action:", nextActionId);
    alert("Next Action Session will be implemented in Phase 5");
  }

  async _handleCompleteNextAction(nextActionId) {
    try {
      const { completeNextAction } =
        await import("../../application/commands/CompleteNextAction.js");
      await completeNextAction(this.deps, { nextActionId });
      const newContent = await this.render(this.projectId);
      this.element.replaceWith(newContent);
      this.element = newContent;
    } catch (err) {
      alert(err.message);
    }
  }

  async _handleDeferNextAction(nextActionId) {
    try {
      const { deferNextAction } =
        await import("../../application/commands/DeferNextAction.js");
      await deferNextAction(this.deps, { nextActionId });
      const newContent = await this.render(this.projectId);
      this.element.replaceWith(newContent);
      this.element = newContent;
    } catch (err) {
      alert(err.message);
    }
  }

  async _handleBlockNextAction(nextActionId) {
    try {
      const { blockNextAction } =
        await import("../../application/commands/BlockNextAction.js");
      await blockNextAction(this.deps, { nextActionId });
      const newContent = await this.render(this.projectId);
      this.element.replaceWith(newContent);
      this.element = newContent;
    } catch (err) {
      alert(err.message);
    }
  }

  _showCreateNextActionModal() {
    console.log("[ProjectDetailScreen] Create Next Action modal - TODO");
  }
}
