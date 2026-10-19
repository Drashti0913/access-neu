import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createIndexes as createReportIndexes } from "./backend/db/accessReportsDB.js";
import { connectToDb } from "./backend/db/connection.js";
import { createIndexes as createSpaceIndexes } from "./backend/db/quietSpacesDB.js";
import accessReportsRouter from "./backend/routes/accessReports.js";
import metaRouter from "./backend/routes/meta.js";
import quietSpacesRouter from "./backend/routes/quietSpaces.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(dirname, "frontend")));

app.use("/api/meta", metaRouter);
app.use("/api/reports", accessReportsRouter);
app.use("/api/spaces", quietSpacesRouter);

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res
    .status(status)
    .json({ error: status === 500 ? "Something went wrong." : err.message });
});

await connectToDb();
await Promise.all([createReportIndexes(), createSpaceIndexes()]);

app.listen(PORT, () => {
  console.log(`AccessNEU running on http://localhost:${PORT}`);
});
