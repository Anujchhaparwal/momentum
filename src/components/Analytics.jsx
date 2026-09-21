import "./Analytics.css";

function Analytics({ tasks, goals, habits, transactions }) {
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const taskCompletionRate =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const activeGoals = goals.length - completedGoals;

  const averageHabitStreak =
    habits.length === 0
      ? 0
      : (
        habits.reduce(
          (total, habit) => total + habit.streak,
          0
        ) / habits.length
      ).toFixed(1);

  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  const spendingByCategory = transactions
    .filter((item) => item.type === "Expense")
    .reduce((categories, item) => {
      categories[item.category] =
        (categories[item.category] || 0) + item.amount;


      return categories;
    }, {});

  const maxCategorySpending = Math.max(
    ...Object.values(spendingByCategory),
    0
  );

  const topCategory = Object.entries(spendingByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <p className="page-description">
        Understand your progress across Momentum.
      </p>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Task Completion</h3>
          <p>{taskCompletionRate}%</p>
          <span>
            {completedTasks} of {tasks.length} completed
          </span>
        </div>

        <div className="analytics-card">
          <h3>Active Goals</h3>
          <p>{activeGoals}</p>
          <span>{completedGoals} completed</span>
        </div>

        <div className="analytics-card">
          <h3>Average Habit Streak</h3>
          <p>{averageHabitStreak}</p>
          <span>days</span>
        </div>

        <div className="analytics-card">
          <h3>Balance</h3>
          <p>₹{balance.toLocaleString()}</p>
          <span>
            ₹{expenses.toLocaleString()} spent
          </span>
        </div>

        <div className="analytics-insight">
          {topCategory ? (
            <p>
              Biggest spending category:{" "}
              <strong>{topCategory[0]}</strong>{" "}
              (₹{topCategory[1].toLocaleString()})
            </p>
          ) : (
            <p>No spending data yet.</p>
          )}
        </div>
      </div>

      <div className="analytics-section">
        <h2>Financial Overview</h2>

        <div className="finance-overview">
          <div>
            <span>Income</span>
            <strong>₹{income.toLocaleString()}</strong>
          </div>

          <div>
            <span>Expenses</span>
            <strong>₹{expenses.toLocaleString()}</strong>
          </div>

          <div>
            <span>Balance</span>
            <p className={balance >= 0 ? "positive" : "negative"}>
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="analytics-section">
          <h2>Spending by Category</h2>

          <div className="category-list">
            {Object.keys(spendingByCategory).length === 0 ? (
              <p className="empty-state">
                No expense data yet.
              </p>
            ) : (
              Object.entries(spendingByCategory)
                .sort((a, b) => b[1] - a[1]).map(
                  ([category, amount]) => {
                    const width =
                      maxCategorySpending === 0
                        ? 0
                        : (amount / maxCategorySpending) * 100;



                    return (
                      <div className="category-item" key={category}>
                        <div className="category-header">
                          <span>{category}</span>
                          <span>₹{amount.toLocaleString()}</span>
                        </div>

                        <div className="category-bar">
                          <div
                            className="category-fill"
                            style={{ width: `${width}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;