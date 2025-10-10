import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// View accounts
router.get("/accounts/view", async (req, res) => {
  try {
    const { rows } = await query("SELECT * from account");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// View individual account
router.get("/accounts/view/:number", async (req, res) => {
  const { number } = req.params;

  try {
    const { rows } = await query(
      "SELECT * FROM account WHERE account_number = $1",
      [number]
    );
    res.send(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Create account GET
router.get("/accounts/new/", async (req, res) => {
  res.render("createAccountForm");
});

// Create account POST
router.post("/accounts/create", async (req, res) => {
  const { name, number, type } = req.body;

  try {
    await query(
      "INSERT INTO account (account_name, account_number, account_type) VALUES ($1, $2, $3)",
      [name, number, type]
    );
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Edit account GET
router.get("/accounts/edit/:number", async (req, res) => {
  const { number } = req.params;

  try {
    const { rows } = await query(
      "SELECT * FROM account WHERE account_number = $1",
      [number]
    );

    if (rows.length === 0) {
      return res.send("No account found.");
    }

    const account = rows[0];

    res.render("editAccountForm", { account });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Edit account POST
router.post("/accounts/edit", async (req, res) => {
  const { id, name, number, type } = req.body;

  try {
    query(
      "UPDATE account SET account_name = $1, account_number = $2, account_type = $3 WHERE account_id = $4",
      [name, number, type, id]
    );
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Delete account POST
router.post("/accounts/delete", async (req, res) => {
  const { id } = req.body;
  try {
    query("DELETE FROM account WHERE account_id = $1", [id]);
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

export { router };
