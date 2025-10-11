import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// View all transactions
router.get("/view", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM transactions");
    res.render("transactions/viewAllTransactions", { rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Could not find any transactions" });
  }
});

// View single transaction
router.get("/view/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { rows: transactionRows } = await query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    const { rows: split } = await query(
      "SELECT s.id, s.transaction_id, s.account_id, a.name, a.number, s.debit, s.credit FROM splits s JOIN accounts a ON s.account_id = a.id WHERE s.transaction_id = $1",
      [id]
    );

    const transaction = transactionRows[0];
    // render split info will go here
    res.render("transactions/viewSingleTransaction", { transaction, split });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Could not find any transactions" });
  }
});

// Edit transaction GET
// Edit transaction POST

// New transaction GET
router.get("/new", async (req, res) => {
  res.render("transactions/createTransactionForm");
});

router.post("/new", async (req, res) => {
  const accounts = req.body.account;
  const debits = req.body.debit;
  const credits = req.body.credit;

  // Basic input validation (keep it simple)
  if (
    !Array.isArray(accounts) ||
    !Array.isArray(debits) ||
    !Array.isArray(credits)
  ) {
    return res
      .status(400)
      .json({ error: "account, debit and credit must be arrays." });
  }
  if (
    !(accounts.length === debits.length && accounts.length === credits.length)
  ) {
    return res.status(400).json({
      error: "Array lengths of account, debit and credit must match.",
    });
  }

  const transactions = [];

  for (let i = 0; i < accounts.length; i++) {
    transactions.push({
      account: accounts[i],
      debit: parseFloat(debits[i]) || 0,
      credit: parseFloat(credits[i]) || 0,
    });
  }

  // Optional quick balance check (recommended)
  const totalDebits = transactions.reduce((s, t) => s + t.debit, 0);
  const totalCredits = transactions.reduce((s, t) => s + t.credit, 0);
  if (Math.abs(totalDebits - totalCredits) > 1e-9) {
    return res.status(400).json({
      error: "Unbalanced journal entry: total debits must equal total credits.",
      totalDebits,
      totalCredits,
    });
  }

  // Inserting transaction & splits in a DB transaction
  try {
    await query("BEGIN");

    const { rows } = await query(
      "INSERT INTO transactions (date, memo) VALUES ($1, $2) RETURNING id",
      [req.body.date, req.body.memo]
    );
    const insertedId = rows[0].id;

    for (const tran of transactions) {
      // find account id
      const acctRes = await query("SELECT id FROM accounts WHERE name = $1", [
        tran.account,
      ]);
      if (!acctRes.rows || acctRes.rows.length === 0) {
        // unknown account -> rollback and respond 400
        await query("ROLLBACK");
        return res
          .status(400)
          .json({ error: `Unknown account: ${tran.account}` });
      }
      const accountId = acctRes.rows[0].id;

      // insert split
      await query(
        "INSERT INTO splits (transaction_id, account_id, debit, credit) VALUES ($1, $2, $3, $4)",
        [insertedId, accountId, tran.debit, tran.credit]
      );
    }

    await query("COMMIT");
    return res.status(201).redirect("/transactions/view");
  } catch (err) {
    // Attempt rollback on any error and return a single 500
    try {
      await query("ROLLBACK");
    } catch (rbErr) {
      console.error("Rollback failed:", rbErr);
    }
    console.error("Database error:", err);
    return res.status(500).json({ error: "Failed to create journal entry." });
  }
});

export { router as transactionRouter };
