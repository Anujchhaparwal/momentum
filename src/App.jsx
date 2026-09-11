import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Goals from "./components/Goals";
import { useState } from "react";
import Habits from "./components/Habits";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
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