import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import path from "path";

import { middleware } from "./middlewares.js";
import { router } from "./routes/accounting.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = "3000";

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/", router);
// app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
