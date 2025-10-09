import { Router } from "express";

const router = Router();

router.get("/pie", (req, res) => {
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
