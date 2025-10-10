import { Router } from "express";
import { query } from "../db/index.js";

const router = Router();

// New transaction GET
router.get("/new", async (req, res) => {
  res.render("transactions/createTransactionForm");
});

router.post("/new", async (req, res) => {
  res.send(req.body);
});

router.post("/splits/new", async (req, res) => {
  res.send(req.body);
});

export { router as transactionRouter };
