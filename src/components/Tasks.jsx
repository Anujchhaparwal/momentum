
import { useState } from "react";
import "./Tasks.css";

const API_URL = "http://localhost:5000/api/v1";

function Tasks({ tasks, setTasks }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPriority, setEditedPriority] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Add a new task
  const addTask = async () => {
    if (!task.trim()) return;

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: task.trim(),
          priority: priority || "Default",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add task");
      }

      setTasks((prevTasks) => [...prevTasks, data.task]);
      setTask("");
      setPriority("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Update a task
  const updateTask = async (taskId, updates) => {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          item._id === taskId ? data.task : item
        )
      );

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setError("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks((prevTasks) =>
        prevTasks.filter((item) => item._id !== taskId)
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      <p className="page-description">
        Organize what needs to get done.
      </p>

      <div className="task-input">
        <input
          placeholder="Add a new task..."
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />

        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="" disabled>Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={addTask} disabled={saving}>
          {saving ? "Saving..." : "Add"}
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <h2>My Tasks</h2>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet.</p>
        ) : (
          tasks.map((taskItem) => (
            <div className="task-item" key={taskItem._id}>
              <div className="task-info">
                <input
                  type="checkbox"
                  checked={taskItem.completed}
                  disabled={saving}
                  onChange={() =>
                    updateTask(taskItem._id, {
                      completed: !taskItem.completed,
                    })
                  }
                />

                {editingTaskId === taskItem._id ? (
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(event) =>
                      setEditedTitle(event.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  <span className={taskItem.completed ? "completed" : ""}>
                    {taskItem.title}
                  </span>
                )}
              </div>

              <div className="priority-slot">
                {editingTaskId === taskItem._id ? (
                  <select
                    value={editedPriority}
                    onChange={(event) =>
                      setEditedPriority(event.target.value)
                    }
                  >
                    <option value="Default">No priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  taskItem.priority && (
                    <span className={`priority ${taskItem.priority.toLowerCase()}`}>
                      {taskItem.priority === "Default" ? "" : taskItem.priority}
                    </span>
                  )
                )}
              </div>

              {editingTaskId === taskItem._id ? (
                <>
                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={async () => {
                      if (!editedTitle.trim()) return;

                      const updated = await updateTask(taskItem._id, {
                        title: editedTitle.trim(),
                        priority: editedPriority || "Default",
                      });

                      if (updated) {
                        setEditingTaskId(null);
                        setEditedTitle("");
                        setEditedPriority("");
                      }
                    }}
                  >
                    Save
                  </button>

                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={() => {
                      setEditingTaskId(null);
                      setEditedTitle("");
                      setEditedPriority("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-button"
                    disabled={saving}
                    onClick={() => {
                      setEditingTaskId(taskItem._id);
                      setEditedTitle(taskItem.title);
                      setEditedPriority(taskItem.priority || "Default");
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    disabled={saving}
                    onClick={() => deleteTask(taskItem._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
