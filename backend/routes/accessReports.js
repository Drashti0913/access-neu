import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReport,
  listReports,
  updateReport,
} from "../db/accessReportsDB.js";
import { parsePaging } from "../db/pagination.js";
import { reportFilters, validateReport } from "../validation/accessReports.js";
import { validateId } from "./validateId.js";

const router = Router();

router.get("/", async (req, res) => {
  const paging = parsePaging(req.query);
  const { items, total } = await listReports(reportFilters(req.query), paging);
  res.json({ items, total, page: paging.page, limit: paging.limit });
});

router.get("/:id", validateId, async (req, res) => {
  const report = await getReport(req.params.id);
  if (!report) return res.status(404).json({ error: "Report not found." });
  res.json(report);
});

router.post("/", async (req, res) => {
  const { errors, value } = validateReport(req.body);
  if (errors) return res.status(400).json({ errors });
  res.status(201).json(await createReport(value));
});

router.put("/:id", validateId, async (req, res) => {
  const { errors, value } = validateReport(req.body);
  if (errors) return res.status(400).json({ errors });
  const report = await updateReport(req.params.id, value);
  if (!report) return res.status(404).json({ error: "Report not found." });
  res.json(report);
});

router.delete("/:id", validateId, async (req, res) => {
  const deleted = await deleteReport(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Report not found." });
  res.status(204).end();
});

export default router;
