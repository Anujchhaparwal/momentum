import { useState } from "react";
import "./Goals.css"


function Goals({ goals, setGoals }) {
  const [goal, setGoal] = useState("");

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
        <button
          onClick={() => {
            if (!goal.trim()) return;

            setGoals([
              ...goals,
              {
                id: Date.now(),
                title: goal,
                progress: 0,
                completed: false,
              },
            ]);

            setGoal("");
          }}
        >
          Add
        </button>
      </div>

      <h2>My Goals</h2>
      <div className="goal-list">
        {goals.length === 0 ? (
          <p className="empty-state">No goals yet.</p>
        ) : (

          goals.map((goalItem) => (
            <div
              className={`goal-item ${goalItem.completed ? "goal-completed" : ""}`}
              key={goalItem.id}
            >
              <div className="goal-details">
                <span className={goalItem.completed ? "completed" : ""}>
                  {goalItem.title}
                </span>

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
                  onChange={(event) => {
                    setGoals(
                      goals.map((item) =>
                        item.id === goalItem.id
                          ? {
                            ...item,
                            progress: Number(event.target.value),
                            completed: Number(event.target.value) === 100
                          }
                          : item
                      )
                    );
                  }}
                />
              </div>


              <button
                onClick={() => {
                  setGoals(
                    goals.filter((item) => item.id !== goalItem.id)
                  );
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Goals;