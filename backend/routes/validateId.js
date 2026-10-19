import { isValidId } from "../validation/helpers.js";

export function validateId(req, res, next) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid id." });
  }
  next();
}
