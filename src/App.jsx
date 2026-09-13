import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Goals from "./components/Goals";
import { useState, useEffect } from "react";
import Habits from "./components/Habits";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [goals, setGoals] = useState(() => {
    return JSON.parse(localStorage.getItem("goals")) || [];
  });
  const [habits, setHabits] = useState(() => {
    return JSON.parse(localStorage.getItem("habits")) || [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />

      <main>
        {activePage === "Dashboard" && <Dashboard setTasks={setTasks} tasks={tasks} goals={goals} habits={habits} />}

        {activePage === "Tasks" && <Tasks tasks={tasks} setTasks={setTasks} />}

        {activePage === "Goals" && <Goals goals={goals} setGoals={setGoals} />}

        {activePage === "Habits" && <Habits habits={habits} setHabits={setHabits} />}

        {activePage === "Finances" && <h1>Finances</h1>}

        {activePage === "Analytics" && <h1>Analytics</h1>}
      </main>
    </div>
  );
}

export default App;