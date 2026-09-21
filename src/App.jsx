import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Goals from "./components/Goals";
import { useState, useEffect } from "react";
import Habits from "./components/Habits";
import "./styles/shared.css"
import Finances from "./components/Finances";
import Analytics from "./components/Analytics";
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
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem("transactions")) || [];
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
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main>
        {activePage === "Dashboard" && <Dashboard setTasks={setTasks} tasks={tasks} goals={goals} habits={habits} />}

        {activePage === "Tasks" && <Tasks tasks={tasks} setTasks={setTasks} />}

        {activePage === "Goals" && <Goals goals={goals} setGoals={setGoals} />}

        {activePage === "Habits" && <Habits habits={habits} setHabits={setHabits} />}

        {activePage === "Finances" && <Finances transactions={transactions} setTransactions={setTransactions} />}

        {activePage === "Analytics" && <Analytics tasks={tasks} goals={goals} habits={habits}
          transactions={transactions} />}
      </main>
    </div>
  );
}

export default App;