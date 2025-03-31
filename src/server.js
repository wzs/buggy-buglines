import express from "express";
import cors from "cors";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import flightsData from "./mockData.js";

const app = express();
const PORT = 3001;
const DELAY = 1000;

app.use(cors());
app.use(express.json());
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), "dist")));

app.get("/", (req, res) => {
  if (!req.query.to || !req.query.from || !req.query.depart) {
    res.status(400).json({ success: false, error: "missing required params" });
  } else if (isNaN(Date.parse(req.query.depart))) {
    res.status(400).json({ success: false, error: "incorrect depart format" });
  } else if (req.query.to === req.query.from) {
    res
      .status(400)
      .json({ success: false, error: "to and from should not be the same" });
  } else {
    setTimeout(() => {
      res.json(flightsData);
    }, DELAY);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
