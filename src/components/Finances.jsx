import { useState } from "react";
import API_URL from "../config/api";
import "./Finances.css";

function Finances({ transactions, setTransactions }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addTransaction = async () => {
    if (!description.trim() || !amount || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          description: description.trim(),
          amount: Number(amount),
          type,
          category,
          date: new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add transaction");
      }

      setTransactions((previousTransactions) => [
        data.transaction,
        ...previousTransactions,
      ]);

      setDescription("");
      setAmount("");
      setType("Expense");
      setCategory("Food");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTransaction = async (transactionId) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/transactions/${transactionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }

      setTransactions((previousTransactions) =>
        previousTransactions.filter(
          (item) => item._id !== transactionId
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  return (
    <div className="finance-page">
      <h1>Finances</h1>

      <p className="page-description">
        Keep track of your income and expenses.
      </p>

      <div className="finance-summary">
        <div className="finance-card">
          <h3>Income</h3>
          <p>₹{income.toLocaleString()}</p>
        </div>

        <div className="finance-card">
          <h3>Expenses</h3>
          <p>₹{expenses.toLocaleString()}</p>
        </div>

        <div className="finance-card">
          <h3>Balance</h3>
          <p>₹{balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="transaction-input">
        <input
          placeholder="Description..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        <button onClick={addTransaction} disabled={saving}>
          {saving ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <h2>Transactions</h2>

      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p className="empty-state">No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              className="transaction-item"
              key={transaction._id}
            >
              <div>
                <strong>{transaction.description}</strong>
                <span>
                  {transaction.category} ·{" "}
                  {transaction.date.split("T")[0]}
                </span>
              </div>

              <span>
                {transaction.type === "Income" ? "+" : "-"}₹
                {transaction.amount.toLocaleString()}
              </span>

              <button
                onClick={() => deleteTransaction(transaction._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Finances;
