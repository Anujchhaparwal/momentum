import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar({ activePage, setActivePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const navigationItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Tasks", icon: "✓" },
    { name: "Goals", icon: "◇" },
    { name: "Habits", icon: "↻" },
    { name: "Finances", icon: "₹" },
    { name: "Analytics", icon: "▥" },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <>
      <div className="mobile-header">
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <h2>Momentum</h2>
      </div>

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      <div className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <h2>Momentum</h2>
          <span>Personal dashboard</span>
          
          {user?.isDemo && (
            <span className="demo-indicator">DEMO ACCOUNT</span>
          )}
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""
                }`}
              onClick={() => handleNavigation(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="nav-icon">↪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
