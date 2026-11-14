import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Tasks from "./components/Tasks";
import Goals from "./components/Goals";
import { useState, useEffect } from "react";
import Habits from "./components/Habits";
import "./styles/shared.css";
import Finances from "./components/Finances";
import Analytics from "./components/Analytics";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import VerifyEmail from "./pages/VerifyEmail";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function DashboardApp() {
  const [activePage, setActivePage] = useState("Dashboard");

  // Tasks are now loaded from MongoDB
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");

  // These will be connected to MongoDB later
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/tasks",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        setTasks(data.tasks);
      } catch (error) {
        setTasksError(error.message);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main>
        {tasksError && <p className="auth-error">{tasksError}</p>}

        {activePage === "Dashboard" && (
          tasksLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <Dashboard
              setTasks={setTasks}
              tasks={tasks}
              goals={goals}
              habits={habits}
              setActivePage={setActivePage}
            />
          )
        )}

        {activePage === "Tasks" && (
          tasksLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <Tasks tasks={tasks} setTasks={setTasks} />
          )
        )}

        {activePage === "Goals" && (
          <Goals goals={goals} setGoals={setGoals} />
        )}

        {activePage === "Habits" && (
          <Habits habits={habits} setHabits={setHabits} />
        )}

        {activePage === "Finances" && (
          <Finances
            transactions={transactions}
            setTransactions={setTransactions}
          />
        )}

        {activePage === "Analytics" && (
          <Analytics
            tasks={tasks}
            goals={goals}
            habits={habits}
            transactions={transactions}
          />
        )}
      </main>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Login and Register routes will be added next */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
