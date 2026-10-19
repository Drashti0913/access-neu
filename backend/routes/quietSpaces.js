import { Router } from "express";
import { parsePaging } from "../db/pagination.js";
import {
  createSpace,
  deleteSpace,
  getSpace,
  listSpaces,
  updateSpace,
} from "../db/quietSpacesDB.js";
import { spaceFilters, validateSpace } from "../validation/quietSpaces.js";
import { validateId } from "./validateId.js";

const router = Router();

router.get("/", async (req, res) => {
  const paging = parsePaging(req.query);
  const { items, total } = await listSpaces(spaceFilters(req.query), paging);
  res.json({ items, total, page: paging.page, limit: paging.limit });
});

router.get("/:id", validateId, async (req, res) => {
  const space = await getSpace(req.params.id);
  if (!space) return res.status(404).json({ error: "Space not found." });
  res.json(space);
});

router.post("/", async (req, res) => {
  const { errors, value } = validateSpace(req.body);
  if (errors) return res.status(400).json({ errors });
  res.status(201).json(await createSpace(value));
});

router.put("/:id", validateId, async (req, res) => {
  const { errors, value } = validateSpace(req.body);
  if (errors) return res.status(400).json({ errors });
  const space = await updateSpace(req.params.id, value);
  if (!space) return res.status(404).json({ error: "Space not found." });
  res.json(space);
});

router.delete("/:id", validateId, async (req, res) => {
  const deleted = await deleteSpace(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Space not found." });
  res.status(204).end();
});

export default router;
