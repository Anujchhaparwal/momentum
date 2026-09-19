import "./Sidebar.css"

function Sidebar({ setActivePage }) {
  return (
    <div className="sidebar">
      <h2>Momentum</h2>
      
      <div className="navigation">
        <p onClick={() => setActivePage("Dashboard")}>Dashboard</p>
        <p onClick={() => setActivePage("Tasks")}>Tasks</p>
        <p onClick={() => setActivePage("Goals")}>Goals</p>
        <p onClick={() => setActivePage("Habits")}>Habits</p>
        <p onClick={() => setActivePage("Finances")}>Finances</p>
        <p onClick={() => setActivePage("Analytics")}>Analytics</p>
      </div>

    </div>
  );
}

export default Sidebar;