import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

router.get("/accounts", async (req, res) => {
  const { rows } = await query("SELECT * from account");
  res.json(rows);
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
