import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res) => {
  res.send("Hello world!");
  console.log("Response sent");
};
