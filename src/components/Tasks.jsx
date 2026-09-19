import { useState } from "react";
import "./Tasks.css";

function Tasks({ tasks, setTasks }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      <p className="page-description">
        Organize what needs to get done.
      </p>

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

      <h2>My Tasks</h2>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet.</p>
        ) : (

          tasks.map((taskItem) => (
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
                {editingTaskId === taskItem.id ? (
                  <input
                    type = "text"
                    value={editedTitle}
                    onChange={(event) => setEditedTitle(event.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className={taskItem.completed ? "completed" : ""}>
                    {taskItem.title}
                  </span>
                )}
              </div>

              <span className={`priority ${taskItem.priority.toLowerCase()}`}>
                {taskItem.priority}
              </span>
              {editingTaskId === taskItem.id ? (
                <>
                  <button
                    onClick={() => {
                      if (!editedTitle.trim()) return;

                      setTasks(
                        tasks.map((item) =>
                          item.id === taskItem.id
                            ? { ...item, title: editedTitle.trim() }
                            : item
                        )
                      );

                      setEditingTaskId(null);
                      setEditedTitle("");
                    }}
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditedTitle("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingTaskId(taskItem.id);
                      setEditedTitle(taskItem.title);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setTasks(
                        tasks.filter((item) => item.id !== taskItem.id)
                      );
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div >

          ))
        )}

      </div>
    </div >
  );
}

export default Tasks;