import StatCard from "./statCard";
import TaskItem from "./TaskItem";

function Dashboard({ tasks, setTasks, goals, habits }) {

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
          value={`${goals.filter((goal) => !goal.completed).length} active`}
        />
        <StatCard
          title="Habits"
          value={`${habits.filter((habit) => !habit.completed).length} active`}
        />

      </div>
      <div className="tasks-section">
        <h2>Today's Tasks</h2>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet.</p>
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
      <div className="goals-section">
        <h2>Active Goals</h2>
        <div className="goal-list">
          {goals.filter((goalItem) => !goalItem.completed).length === 0 ? (
            <p className="empty-state">No active goals yet.</p>
          ) : (

            goals
              .filter((goalItem) => !goalItem.completed)
              .map((goalItem) => (
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
            <p className="empty-state">No habits yet.</p>
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
  );
}

export default Dashboard;