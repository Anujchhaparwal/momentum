import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import { useState } from "react";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />

      <main>
        {activePage === "Dashboard" && <Dashboard />}

        {activePage === "Tasks" && <Tasks />}

        {activePage === "Goals" && <h1>Goals</h1>}

        {activePage === "Habits" && <h1>Habits</h1>}

        {activePage === "Finances" && <h1>Finances</h1>}

        {activePage === "Analytics" && <h1>Analytics</h1>}
      </main>
    </div>
  );
}

export default App;