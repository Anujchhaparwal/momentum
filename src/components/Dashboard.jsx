import StatCard from "./statCard";
import TaskItem from "./TaskItem";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Good morning</p>
      </div>
      <div className="stats">
        <StatCard title="Tasks" value="7/10 conmpleted" />
        <StatCard title="Habits" value="4 / 5 completed" />
        <StatCard title="Goals" value="3 active" />
      </div>
      <div className="tasks-section">
        <h2>Today's Tasks</h2>

        <div className="task-list">
          <TaskItem title="Finish React project" priority="High" />
          <TaskItem title="Complete French exercise" priority="Medium" />
          <TaskItem title="Go for a walk" priority="Done" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;