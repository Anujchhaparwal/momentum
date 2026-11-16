import { useState } from "react";
import API_URL from "../config/api";
import "./Goals.css";

function Goals({ goals, setGoals }) {
  const [goal, setGoal] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Add a new goal
  const addGoal = async () => {
    if (!goal.trim()) return;

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: goal.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add goal");
      }

      setGoals((prevGoals) => [...prevGoals, data.goal]);
      setGoal("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Update goal title or progress
  const updateGoal = async (goalId, updates) => {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update goal");
      }

      setGoals((prevGoals) =>
        prevGoals.map((item) =>
          item._id === goalId ? data.goal : item
        )
      );

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete goal");
      }

      setGoals((prevGoals) =>
        prevGoals.filter((item) => item._id !== goalId)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="goals-page">
      <h1>Goals</h1>

      <p className="page-description">
        Set goals and track your progress.
      </p>

      <div className="goal-input">
        <input
          placeholder="Add a new goal..."
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
        />

        <button onClick={addGoal} disabled={saving}>
          {saving ? "Saving..." : "Add"}
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <h2>My Goals</h2>

      <div className="goal-list">
        {goals.length === 0 ? (
          <p className="empty-state">No goals yet.</p>
        ) : (
          goals.map((goalItem) => (
            <div
              className={`goal-item ${goalItem.completed ? "goal-completed" : ""}`}
              key={goalItem._id}
            >
              <div className="goal-details">
                {editingGoalId === goalItem._id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(event) =>
                      setEditedTitle(event.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  <span className={goalItem.completed ? "completed" : ""}>
                    {goalItem.title}
                  </span>
                )}

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${goalItem.progress}%` }}
                  ></div>
                </div>

                <div className="progress-label">
                  <span>Progress</span>
                  <span>{goalItem.progress}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goalItem.progress}
                  disabled={saving}
                  onChange={(event) =>
                    updateGoal(goalItem._id, {
                      progress: Number(event.target.value),
                    })
                  }
                />
              </div>

              {editingGoalId === goalItem._id ? (
                <>
                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={async () => {
                      if (!editedTitle.trim()) return;

                      const updated = await updateGoal(goalItem._id, {
                        title: editedTitle.trim(),
                      });

                      if (updated) {
                        setEditingGoalId(null);
                        setEditedTitle("");
                      }
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={() => {
                      setEditingGoalId(null);
                      setEditedTitle("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={() => {
                      setEditingGoalId(goalItem._id);
                      setEditedTitle(goalItem.title);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    disabled={saving}
                    onClick={() => deleteGoal(goalItem._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Goals;
