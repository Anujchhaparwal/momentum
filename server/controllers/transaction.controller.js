import Transaction from "../models/Transaction.js";

const parseTransactionDate = (date) => {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);

  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return parsedDate;
};

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body || {};

    // Validate description
    if (
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 100
    ) {
      return res.status(400).json({
        message: "Please provide a valid transaction description",
      });
    }

    // Validate amount
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be a positive number",
      });
    }

    // Validate transaction type
    if (!["Income", "Expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    // Validate category
    const validCategories = [
      "Food",
      "Transport",
      "Shopping",
      "Bills",
      "Entertainment",
      "Other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid transaction category",
      });
    }

    if (date !== undefined && !parseTransactionDate(date)) {
      return res.status(400).json({
        message: "Please provide a valid transaction date",
      });
    }

    // Create transaction
    const newTransaction = await Transaction.create({
      description: description.trim(),
      amount,
      type,
      category,
      date: date === undefined ? undefined : parseTransactionDate(date),
      user: req.user.userId,
    });

    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid transaction details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating the transaction",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.userId,
    }).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      count: transactions.length,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching transactions",
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body || {};

    const updates = {};

    // Validate description
    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim() ||
        description.trim().length > 100
      ) {
        return res.status(400).json({
          message: "Please provide a valid transaction description",
        });
      }

      updates.description = description.trim();
    }

    // Validate amount
    if (amount !== undefined) {
      if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          message: "Amount must be a positive number",
        });
      }

      updates.amount = amount;
    }

    // Validate type
    if (type !== undefined) {
      if (!["Income", "Expense"].includes(type)) {
        return res.status(400).json({
          message: "Invalid transaction type",
        });
      }

      updates.type = type;
    }

    // Validate category
    if (category !== undefined) {
      const validCategories = [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Other",
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: "Invalid transaction category",
        });
      }

      updates.category = category;
    }

    // Validate date
    if (date !== undefined) {
      const parsedDate = parseTransactionDate(date);

      if (!parsedDate) {
        return res.status(400).json({
          message: "Please provide a valid transaction date in YYYY-MM-DD format",
        });
      }

      updates.date = parsedDate;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one field to update",
      });
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      updates,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid transaction details",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while updating the transaction",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedTransaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    return res.status(500).json({
      message: "Something went wrong while deleting the transaction",
    });
  }
};