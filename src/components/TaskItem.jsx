function TaskItem({ title, priority, completed, onToggle }) {
  return (
    <div className="task-item">
      <div className="task-info">
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
        />

        <span className={completed ? "completed" : ""}>
          {title}
        </span>
      </div>

      <span className={`priority ${priority.toLowerCase()}`}>
        {priority}
      </span>
    </div>
  );
}

export default TaskItem;