import API_URL from "./config/api";
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


function AuthLoadingScreen() {
  return (
    <div className="auth-status-page">
      <div className="auth-status-card">
        <div className="loading-spinner"></div>

        <h2>Waking up Momentum...</h2>

        <p>
          Our backend is hosted on Render's free tier, which may
          temporarily go to sleep after inactivity.
        </p>

        <p>
          The first visit may take a little longer while the
          server wakes up. Subsequent visits should be faster.
        </p>

        <span>Thanks for your patience!</span>
      </div>
    </div>
  );
}


function AuthErrorScreen() {
  return (
    <div className="auth-status-page">
      <div className="auth-status-card">
        <h2>Unable to connect to Momentum</h2>

        <p>
          We couldn't reach our server. It may be temporarily
          unavailable. Please try again.
        </p>

        <button
          className="auth-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading, authError } = useAuth();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (authError) {
    return <AuthErrorScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function DashboardApp() {
  const [activePage, setActivePage] = useState("Dashboard");


  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");


  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState("");

  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [habitsError, setHabitsError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/tasks`,
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

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(
          `${API_URL}/goals`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch goals");
        }

        setGoals(data.goals);
      } catch (error) {
        setGoalsError(error.message);
      } finally {
        setGoalsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(
          `${API_URL}/habits`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch habits");
        }

        setHabits(data.habits);
      } catch (error) {
        setHabitsError(error.message);
      } finally {
        setHabitsLoading(false);
      }
    };

    fetchHabits();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${API_URL}/transactions`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch transactions");
        }

        setTransactions(data.transactions);
      } catch (error) {
        setTransactionsError(error.message);
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main>
        {tasksError && <p className="auth-error">{tasksError}</p>}
        {goalsError && <p className="auth-error">{goalsError}</p>}
        {habitsError && <p className="auth-error">{habitsError}</p>}
        {transactionsError && <p className="auth-error">{transactionsError}</p>}

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
          goalsLoading ? (
            <p>Loading goals...</p>
          ) : (
            <Goals goals={goals} setGoals={setGoals} />
          )
        )}

        {activePage === "Habits" && (
          habitsLoading ? (
            <p>Loading habits...</p>
          ) : (
            <Habits habits={habits} setHabits={setHabits} />
          )
        )}

        {activePage === "Finances" && (
          transactionsLoading ? (
            <p>Loading transactions...</p>
          ) : (
            <Finances
              transactions={transactions}
              setTransactions={setTransactions}
            />
          )
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
