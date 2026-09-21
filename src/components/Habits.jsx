import { useState, useEffect } from "react";
import "./Habits.css"

const getToday = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

function Habits({ habits, setHabits }) {
  const [habit, setHabit] = useState("");

  useEffect(() => {
    const today = getToday();

    const updatedHabits = habits.map((item) => {
      if (
        item.completed &&
        item.lastCompletedDate !== today
      ) {
        return {
          ...item,
          completed: false,
        };
      }

      return item;
    });

    const hasChanged = updatedHabits.some(
      (item, index) =>
        item.completed !== habits[index].completed
    );

    if (hasChanged) {
      setHabits(updatedHabits);
    }
  }, [habits, setHabits]);

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
                streak: 0,
                lastCompletedDate: null,
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
                  const today = getToday();

                  setHabits(
                    habits.map((item) => {
                      if (item.id !== habitItem.id) return item;

                      if (item.completed) {
                        return {
                          ...item,
                          completed: false,
                        };
                      }

                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      const yesterdayString = yesterday
                        .toISOString()
                        .split("T")[0];

                      const newStreak =
                        item.lastCompletedDate === today
                          ? item.streak
                          : item.lastCompletedDate === yesterdayString
                            ? item.streak + 1
                            : 1;

                      return {
                        ...item,
                        completed: true,
                        streak: newStreak,
                        lastCompletedDate: today,
                      };
                    })
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