import { useState } from "react";
import API_URL from "../config/api";
import "./Habits.css";

function Habits({ habits, setHabits }) {
  const [habit, setHabit] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addHabit = async () => {
    if (!habit.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: habit.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add habit");
      }

      setHabits((previousHabits) => [
        data.habit,
        ...previousHabits,
      ]);

      setHabit("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleHabit = async (habitId) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/habits/${habitId}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update habit");
      }

      setHabits((previousHabits) =>
        previousHabits.map((item) =>
          item._id === habitId ? data.habit : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteHabit = async (habitId) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/habits/${habitId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete habit");
      }

      setHabits((previousHabits) =>
        previousHabits.filter((item) => item._id !== habitId)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="habits-page">
      <h1>Habits</h1>

      <div className="habit-input">
        <input
          placeholder="Add a new habit..."
          value={habit}
          onChange={(event) => setHabit(event.target.value)}
        />

        <button onClick={addHabit} disabled={saving}>
          {saving ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <div className="habit-list">
        {habits.map((habitItem) => (
          <div className="habit-item" key={habitItem._id}>
            <div className="habit-info">
              <input
                type="checkbox"
                checked={habitItem.completed}
                onChange={() => toggleHabit(habitItem._id)}
              />

              <span className={habitItem.completed ? "completed" : ""}>
                {habitItem.title}
              </span>
            </div>

            <span className="habit-streak">
              {habitItem.streak} day streak
            </span>

            <button onClick={() => deleteHabit(habitItem._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Habits;
