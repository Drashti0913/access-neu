import { Router } from "express";
import {
  BUILDINGS,
  LIGHTING_TYPES,
  NOISE_LEVELS,
  REPORT_CATEGORIES,
  REPORT_SEVERITIES,
  REPORT_STATUSES,
  SPACE_FEATURES,
} from "../constants.js";

const router = Router();

// Lets the frontend build its dropdowns from the same lists the server validates against.
router.get("/", (req, res) => {
  res.json({
    buildings: BUILDINGS,
    reportCategories: REPORT_CATEGORIES,
    reportSeverities: REPORT_SEVERITIES,
    reportStatuses: REPORT_STATUSES,
    noiseLevels: NOISE_LEVELS,
    lightingTypes: LIGHTING_TYPES,
    spaceFeatures: SPACE_FEATURES,
  });
});

export default router;
