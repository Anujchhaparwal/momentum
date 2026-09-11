import { useState } from "react";


function Goals({ goals, setGoals }) {
  const [goal, setGoal] = useState("");
  
  return (
    <div className="goals-page">
      <h1>Goals</h1>
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

      <h2>Active Goals</h2>
      <div className="goal-list">
        {goals.map((goalItem) => (
          <div className="goal-item" key={goalItem.id}>
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

            <span className="goal-progress">{goalItem.progress}%</span>
         
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
        ))}
      </div>
    </div>
  );
}

export default Goals;