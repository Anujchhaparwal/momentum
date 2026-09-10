import { useState } from "react";

function Habits() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);
  return (
    <div className="habits-page">
      <h1>Habits</h1>
      <div className="habit-input">
        <input
          placeholder="Add a new habit..."
          value={habit}
          onChange={(event) => setHabit(event.target.value)}
        />

        <button
          onClick={() => {
            if (!habit.trim()) return;

            setHabits([
              ...habits,
              {
                id: Date.now(),
                title: habit,
                completed: false,
                streak: 0
              },
            ]);

            setHabit("");
          }}
        >
          Add
        </button>
      </div>

      <div className="habit-list">
        {habits.map((habitItem) => (
          <div className="habit-item" key={habitItem.id}>
            <div className="habit-info">
              <input
                type="checkbox"
                checked={habitItem.completed}
                onChange={() => {
                  setHabits(
                    habits.map((item) =>
                      item.id === habitItem.id
                        ? {
                          ...item,
                          completed: !item.completed,
                          streak: item.completed
                            ? item.streak - 1
                            : item.streak + 1,
                        }
                        : item
                    )
                  );
                }}
              />

              <span className={habitItem.completed ? "completed" : ""}>
                {habitItem.title}
              </span>
            </div>
            <span className="habit-streak">
              {habitItem.streak} day streak
            </span>
            <button
              onClick={() => {
                setHabits(
                  habits.filter((item) => item.id !== habitItem.id)
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

export default Habits;