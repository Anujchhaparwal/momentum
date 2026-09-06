import Sidebar from "./components/Sidebar";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;