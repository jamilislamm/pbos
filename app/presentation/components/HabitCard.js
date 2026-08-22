/**
 * HabitCard Component
 * Displays a Habit on the Today screen or Habits list.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §10-17
 */

export class HabitCard {
  /**
   * @param {Object} config
   * @param {Habit} config.habit
   * @param {HabitExecution|null} config.todayExecution
   * @param {Function} config.onStart - Callback when Start is clicked
   * @param {Function} config.onSelectLevel - Callback when level is selected
   */
  constructor(config) {
    this.habit = config.habit;
    this.todayExecution = config.todayExecution;
    this.onStart = config.onStart || (() => {});
    this.onSelectLevel = config.onSelectLevel || (() => {});
    this.element = null;
  }

  /**
   * Render the card.
   * @returns {HTMLElement}
   */
  render() {
    const card = document.createElement("div");
    card.className = "habit-card";
    card.dataset.habitId = this.habit.id;

    const info = document.createElement("div");
    info.className = "habit-card-info";

    const title = document.createElement("div");
    title.className = "habit-card-title";
    title.textContent = this.habit.title;

    const meta = document.createElement("div");
    meta.className = "habit-card-meta";

    // Build meta text based on execution state
    if (this.todayExecution) {
      const actualMin = Math.round(
        this.todayExecution.actualDurationMs / 60000,
      );
      const targetMin = Math.round(
        this.habit.targetConfig.duration.milliseconds / 60000,
      );
      const level = this.todayExecution.selectedLevel;

      if (this.todayExecution.status === "completed") {
        meta.innerHTML = `<span class="badge badge-success">Completed</span> ${actualMin} min`;
      } else if (this.todayExecution.status === "in_progress") {
        meta.innerHTML = `<span class="badge badge-warning">In Progress</span> ${actualMin} / ${targetMin} min`;
      } else if (this.todayExecution.status === "partial") {
        meta.innerHTML = `<span class="badge badge-warning">Partial</span> ${actualMin} / ${targetMin} min`;
      } else {
        meta.innerHTML = `${level === "target" ? "Target" : level === "reduced" ? "Reduced" : "Minimum"}: ${targetMin} min — Today: ${actualMin} min`;
      }
    } else {
      const targetMin = Math.round(
        this.habit.targetConfig.duration.milliseconds / 60000,
      );
      meta.textContent = `Target: ${targetMin} min — Not started today`;
    }

    info.appendChild(title);
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "habit-card-actions";

    if (this.todayExecution && this.todayExecution.status === "in_progress") {
      // Show "Continue" button
      const continueBtn = document.createElement("button");
      continueBtn.className = "btn btn-primary btn-sm";
      continueBtn.textContent = "Continue";
      continueBtn.addEventListener("click", () =>
        this.onStart(this.habit.id, this.todayExecution.id),
      );
      actions.appendChild(continueBtn);
    } else if (
      this.todayExecution &&
      this.todayExecution.status === "completed"
    ) {
      // Show completed badge
      const doneBadge = document.createElement("span");
      doneBadge.className = "badge badge-success";
      doneBadge.textContent = "Done";
      actions.appendChild(doneBadge);
    } else {
      // Show Start button with level selector
      const levelSelect = document.createElement("select");
      levelSelect.className = "habit-level-select";
      levelSelect.innerHTML = `
        <option value="target" selected>Target (${Math.round(this.habit.targetConfig.duration.milliseconds / 60000)}m)</option>
        <option value="reduced">Reduced (${Math.round(this.habit.reducedConfig.duration.milliseconds / 60000)}m)</option>
        <option value="minimum">Minimum (${Math.round(this.habit.minimumConfig.duration.milliseconds / 60000)}m)</option>
      `;
      levelSelect.addEventListener("change", (e) => {
        this.onSelectLevel(this.habit.id, e.target.value);
      });

      const startBtn = document.createElement("button");
      startBtn.className = "btn btn-primary btn-sm";
      startBtn.textContent = "Start";
      startBtn.addEventListener("click", () => {
        const selectedLevel = levelSelect.value;
        this.onStart(this.habit.id, null, selectedLevel);
      });

      actions.appendChild(levelSelect);
      actions.appendChild(startBtn);
    }

    card.appendChild(info);
    card.appendChild(actions);

    this.element = card;
    return card;
  }

  /**
   * Update the card with new execution data.
   * @param {HabitExecution|null} todayExecution
   */
  update(todayExecution) {
    this.todayExecution = todayExecution;
    if (this.element) {
      const newElement = this.render();
      this.element.replaceWith(newElement);
      this.element = newElement;
    }
  }
}
