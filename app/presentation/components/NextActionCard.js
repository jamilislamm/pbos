/**
 * NextActionCard Component
 * Displays a Next Action with status and action buttons.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §22
 */

export class NextActionCard {
  constructor(config) {
    this.nextAction = config.nextAction;
    this.onStart = config.onStart || (() => {});
    this.onComplete = config.onComplete || (() => {});
    this.onDefer = config.onDefer || (() => {});
    this.onBlock = config.onBlock || (() => {});
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "card next-action-card";
    card.dataset.nextActionId = this.nextAction.id;

    const header = document.createElement("div");
    header.className = "card-header";

    const title = document.createElement("span");
    title.className = "card-title";
    title.textContent = this.nextAction.title;

    const statusBadge = document.createElement("span");
    statusBadge.className = `badge badge-${this._getStatusColor(this.nextAction.status)}`;
    statusBadge.textContent = this.nextAction.status;

    header.appendChild(title);
    header.appendChild(statusBadge);

    const body = document.createElement("div");
    body.className = "card-body";
    if (this.nextAction.description) {
      body.textContent = this.nextAction.description;
    }

    const footer = document.createElement("div");
    footer.className = "card-footer";

    if (
      this.nextAction.status === "available" ||
      this.nextAction.status === "active"
    ) {
      const startBtn = document.createElement("button");
      startBtn.className = "btn btn-primary btn-sm";
      startBtn.textContent = "Start";
      startBtn.addEventListener("click", () =>
        this.onStart(this.nextAction.id),
      );

      const completeBtn = document.createElement("button");
      completeBtn.className = "btn btn-secondary btn-sm";
      completeBtn.textContent = "Complete";
      completeBtn.addEventListener("click", () =>
        this.onComplete(this.nextAction.id),
      );

      const deferBtn = document.createElement("button");
      deferBtn.className = "btn btn-ghost btn-sm";
      deferBtn.textContent = "Defer";
      deferBtn.addEventListener("click", () =>
        this.onDefer(this.nextAction.id),
      );

      const blockBtn = document.createElement("button");
      blockBtn.className = "btn btn-ghost btn-sm";
      blockBtn.textContent = "Block";
      blockBtn.addEventListener("click", () =>
        this.onBlock(this.nextAction.id),
      );

      footer.appendChild(startBtn);
      footer.appendChild(completeBtn);
      footer.appendChild(deferBtn);
      footer.appendChild(blockBtn);
    } else if (this.nextAction.status === "blocked") {
      const unblockBtn = document.createElement("button");
      unblockBtn.className = "btn btn-secondary btn-sm";
      unblockBtn.textContent = "Unblock";
      unblockBtn.addEventListener("click", () =>
        this.onStart(this.nextAction.id),
      );
      footer.appendChild(unblockBtn);
    } else {
      const statusText = document.createElement("span");
      statusText.className = "text-muted";
      statusText.textContent = "No actions available";
      footer.appendChild(statusText);
    }

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    this.element = card;
    return card;
  }

  _getStatusColor(status) {
    const colors = {
      available: "primary",
      active: "success",
      blocked: "warning",
      deferred: "warning",
      completed: "success",
      cancelled: "danger",
    };
    return colors[status] || "primary";
  }
}
