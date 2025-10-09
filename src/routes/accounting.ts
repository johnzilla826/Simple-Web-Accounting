import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

router.get("/pie", async (req, res) => {
  await query("SELECT * from users");
  res.send("Pie page");
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
