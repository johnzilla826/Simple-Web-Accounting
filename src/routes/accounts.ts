import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// View accounts
router.get("/view", async (req, res) => {
  try {
    const { rows } = await query("SELECT * from account");
    res.render("accounts/viewAllAccounts", { rows });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// View single account
router.get("/view/:number", async (req, res) => {
  const { number } = req.params;

  try {
    const { rows } = await query(
      "SELECT * FROM account WHERE account_number = $1",
      [number]
    );
    const account = rows[0];
    res.render("accounts/viewSingleAccount", { account });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Create account GET
router.get("/new/", async (req, res) => {
  res.render("accounts/createAccountForm");
});

// Create account POST
router.post("/create", async (req, res) => {
  const { name, number, type, description } = req.body;

  try {
    await query(
      "INSERT INTO account (account_name, account_number, account_type, description) VALUES ($1, $2, $3, $4)",
      [name, number, type, description]
    );
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Edit account GET
router.get("/edit/:number", async (req, res) => {
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

    res.render("accounts/editAccountForm", { account });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Edit account POST
router.post("/edit", async (req, res) => {
  const { id, name, number, type, description } = req.body;

  try {
    await query(
      "UPDATE account SET account_name = $1, account_number = $2, account_type = $3, description = $4 WHERE account_id = $5",
      [name, number, type, description, id]
    );
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

// Delete account POST
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await query("DELETE FROM account WHERE account_id = $1", [id]);
    res.redirect("/accounts/view");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500);
  }
});

export { router as accountRouter };
