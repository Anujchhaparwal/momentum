function TaskItem({ title, priority }) {
  return (
    <div className="task-item">
      <span>{title}</span>
      <span className={`priority ${priority.toLowerCase()}`}>
        {priority}
      </span>
    </div>
  );
}

export default TaskItem;