import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main>
        <h1>Dashboard</h1>
        <p>Welcome to momentum.</p>
      </main>
    </div>
  );
}

export default App;