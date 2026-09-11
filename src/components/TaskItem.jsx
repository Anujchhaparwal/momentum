function TaskItem({ title, priority, completed, onToggle }) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
      />
      <span className={completed ? "completed" : ""}>
        {title}
      </span>
      <span className={`priority ${priority.toLowerCase()}`}>
        {priority}
      </span>
    </div>
  );
}

export default TaskItem;