import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// View accounts
router.get("/accounts/view", async (req, res) => {
  const { rows } = await query("SELECT * from account");
  res.json(rows);
});

// View individual account
router.get("/accounts/view/:number", async (req, res) => {
  const { number } = req.params;
  const { rows } = await query(
    "SELECT * FROM account WHERE account_number = $1",
    [number]
  );
  res.send(rows);
});

// Create account GET
router.get("/accounts/new/", async (req, res) => {
  res.render("createAccountForm");
});

// Create account POST
router.post("/accounts/create", async (req, res) => {
  const { name, number, type } = req.body;

  await query(
    "INSERT INTO account (account_name, account_number, account_type) VALUES ($1, $2, $3)",
    [name, number, type]
  );
  res.redirect("/accounts/view");
});

router.get("/apple", (req, res) => {
  const peopleColors = [
    { name: "Jim", color: "red" },
    { name: "Bob", color: "blue" },
    { name: "Dan", color: "green" },
  ];
  res.render("apple", { peopleColors });
});

export { router };
