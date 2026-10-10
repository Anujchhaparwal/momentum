import StatCard from "./StatCard";
import TaskItem from "./TaskItem";
import "./Dashboard.css";

function Dashboard({ tasks, setTasks, goals, habits, setActivePage }) {
  const activeGoals = goals.filter((goal) => !goal.completed);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back!</h1>
          <p>Stay focused. Every small step moves Momentum forward.</p>
        </div>
      </div>

      <div className="stats">
        <StatCard
          title="Tasks"
          value={`${tasks.filter((task) => task.completed).length} / ${tasks.length} completed`}
        />
        <StatCard
          title="Goals"
          value={`${activeGoals.length} active`}
        />
        <StatCard
          title="Habits"
          value={`${habits.filter((habit) => !habit.completed).length} active`}
        />
      </div>
      <div className="dashboard-grid">
        <div className="tasks-section">
          <h2>Today's Tasks</h2>

          <div className="task-list">
            {tasks.length === 0 ? (
              <div className="dashboard-empty">
                <p>No tasks on your list yet.</p>
                <button onClick={() => setActivePage("Tasks")}>
                  Add your first task
                </button>
              </div>
            ) : (
              [...tasks]
                .sort((a, b) => a.completed - b.completed)
                .slice(0, 5)
                .map((taskItem) => (
                  <TaskItem
                    key={taskItem.id}
                    title={taskItem.title}
                    priority={taskItem.priority}
                    completed={taskItem.completed}
                    onToggle={() => {
                      setTasks(
                        tasks.map((item) =>
                          item.id === taskItem.id
                            ? { ...item, completed: !item.completed }
                            : item
                        )
                      );
                    }}
                  />
                ))
            )}
          </div>
        </div>


        <div className="dashboard-side">
          <div className="goals-section">
            <h2>Active Goals</h2>

            <div className="goal-list">
              {activeGoals.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="empty-icon goal-icon">◎</div>
                  <h3>Your next milestone starts here</h3>
                  <p>
                    Turn something you want to achieve into a goal
                    and track your progress along the way.
                  </p>
                  <button onClick={() => setActivePage("Goals")}>
                    Create a goal <span aria-hidden="true">→</span>
                  </button>
                </div>
              ) : (
                activeGoals.map((goalItem) => (
                  <div className="goal-item" key={goalItem.id}>
                    <div className="goal-details">
                      <span>{goalItem.title}</span>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${goalItem.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <span className="goal-progress">
                      {goalItem.progress}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>


          <div className="habits-section">
            <h2>Today's Habits</h2>

            <div className="habit-list">
              {habits.length === 0 ? (
                <div className="dashboard-empty">
                  <div className="empty-icon habit-icon">↻</div>
                  <h3>Small habits, lasting progress</h3>
                  <p>
                    Start with a simple routine and build consistency
                    one day at a time.
                  </p>
                  <button onClick={() => setActivePage("Habits")}>
                    Start a habit <span aria-hidden="true">→</span>
                  </button>
                </div>
              ) : (
                habits.map((habitItem) => (
                  <div className="habit-item" key={habitItem.id}>
                    <span className={habitItem.completed ? "completed" : ""}>
                      {habitItem.title}
                    </span>

                    <span className="habit-streak">
                      {habitItem.streak} day streak
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;