/**
 * HabitsScreen
 * Displays all Habits with today's execution status.
 *
 * Architecture: UI_UX_ARCHITECTURE.md §10, §18
 */

import { HabitCard } from "../components/HabitCard.js";

export class HabitsScreen {
  /**
   * @param {Object} deps
   * @param {HabitRepository} deps.habitRepository
   * @param {HabitExecutionRepository} deps.habitExecutionRepository
   * @param {Object} deps.systemClock
   * @param {Object} deps.commands - Command functions
   */
  constructor(deps) {
    this.deps = deps;
    this.element = null;
    this.habitCards = new Map();
  }

  /**
   * Render the screen.
   * @returns {HTMLElement}
   */
  async render() {
    const screen = document.createElement("div");
    screen.className = "habits-screen";
    screen.dataset.screen = "habits";
    screen.id = "screen-habits";

    const header = document.createElement("div");
    header.className = "screen-header";
    header.innerHTML = `
      <h1>Habits</h1>
      <button class="btn btn-primary" id="btn-create-habit">+ New Habit</button>
    `;

    const list = document.createElement("div");
    list.className = "habits-list";
    list.id = "habits-list";

    // Load habits
    const habits = await this.deps.habitRepository.findActive();
    const date = this.deps.systemClock.todayDateString();

    for (const habit of habits) {
      const todayExecution =
        await this.deps.habitExecutionRepository.findByHabitIdAndDate(
          habit.id,
          date,
        );

      const card = new HabitCard({
        habit,
        todayExecution,
        onStart: (habitId, executionId, level) =>
          this._handleStart(habitId, executionId, level),
        onSelectLevel: (habitId, level) =>
          this._handleSelectLevel(habitId, level),
      });

      list.appendChild(card.render());
      this.habitCards.set(habit.id, card);
    }

    if (habits.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <h2>No Habits Yet</h2>
          <p>Create your first habit to start building consistency.</p>
        </div>
      `;
    }

    screen.appendChild(header);
    screen.appendChild(list);

    // Create habit button
    const createBtn = header.querySelector("#btn-create-habit");
    if (createBtn) {
      createBtn.addEventListener("click", () => this._showCreateHabitModal());
    }

    this.element = screen;
    return screen;
  }

  /**
   * Handle start button click.
   */
  async _handleStart(habitId, executionId, level) {
    try {
      // If no execution exists, create one first
      if (!executionId) {
        const { createHabitExecution } =
          await import("../../application/commands/CreateHabitExecution.js");
        const execution = await createHabitExecution(this.deps, { habitId });

        // Select level if provided
        if (level && level !== "target") {
          execution.selectLevel(level);
          await this.deps.habitExecutionRepository.save(execution);
        }

        executionId = execution.id;
      }

      // Start the execution
      const { startHabitExecution } =
        await import("../../application/commands/StartHabitExecution.js");
      const { session } = await startHabitExecution(this.deps, {
        habitExecutionId: executionId,
      });

      // Navigate to session screen
      window.location.hash = "session";
    } catch (err) {
      console.error("[HabitsScreen] Failed to start habit:", err);
      alert(err.message);
    }
  }

  /**
   * Handle level selection.
   */
  async _handleSelectLevel(habitId, level) {
    // Level is stored in the card's select element, applied when Start is clicked
    console.log("[HabitsScreen] Level selected:", habitId, level);
  }

  /**
   * Show create habit modal.
   */
  _showCreateHabitModal() {
    // This will be implemented when we have a Modal component
    console.log("[HabitsScreen] Create habit modal - TODO");
  }
}
