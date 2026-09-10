import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Goals from "./components/Goals";
import { useState } from "react";
import Habits from "./components/Habits";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />

      <main>
        {activePage === "Dashboard" && <Dashboard />}

        {activePage === "Tasks" && <Tasks />}

        {activePage === "Goals" && <Goals />}

        {activePage === "Habits" && <Habits />}

        {activePage === "Finances" && <h1>Finances</h1>}

        {activePage === "Analytics" && <h1>Analytics</h1>}
      </main>
    </div>
  );
}

export default App;