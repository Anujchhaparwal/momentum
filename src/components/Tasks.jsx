import { useState } from "react";

function Tasks() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("Medium");
  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      <div className="task-input">
        <input placeholder="Add a new task..."
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={() => {
          if (!task.trim()) return;

          setTasks([...tasks, {
            id: Date.now(),
            title: task,
            priority: priority,
            completed: false,
          },
          ])
          setTask("");
          setPriority("Medium");
        }}
        >Add</button>
      </div>

      <h2>Today's Tasks</h2>

      <div className="task-list">
        {tasks.map((taskItem) => (
          <div className="task-item" key={taskItem.id}>
            <div className="task-info">
              <input
                type="checkbox"
                checked={taskItem.completed}
                onChange={() => {
                  setTasks(
                    tasks.map((item) =>
                      item.id === taskItem.id
                        ? { ...item, completed: !item.completed }
                        : item
                    )
                  );
                }}
              />
              <span className={taskItem.completed ? "completed" : ""}>
                {taskItem.title}
              </span>
            </div>

            <span className={`priority ${taskItem.priority.toLowerCase()}`}>
              {taskItem.priority}
            </span>
            <button onClick={() => {
              setTasks(tasks.filter((item) => item.id !== taskItem.id));
            }}>
              Delete
            </button>
          </div >

        ))}

      </div>
    </div >
  );
}

export default Tasks;