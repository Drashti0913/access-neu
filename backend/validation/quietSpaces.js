import {
  BUILDINGS,
  LIGHTING_TYPES,
  NOISE_LEVELS,
  SPACE_FEATURES,
} from "../constants.js";
import { collect, pickFilters, readChoice, readText } from "./helpers.js";

function readFeatures(body) {
  const raw = body.features ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  const invalid = list.filter((f) => !SPACE_FEATURES.includes(f));
  if (invalid.length) {
    return { error: `Unknown features: ${invalid.join(", ")}.` };
  }
  return { value: [...new Set(list)] };
}

function readCapacity(body) {
  const value = Number(body.capacity);
  if (!Number.isInteger(value) || value < 1 || value > 500) {
    return { error: "Capacity must be a whole number from 1 to 500." };
  }
  return { value };
}

export function validateSpace(body = {}) {
  return collect({
    name: readText(body, "name", { label: "Name", min: 3, max: 80 }),
    building: readChoice(body, "building", {
      label: "Building",
      choices: BUILDINGS,
    }),
    floor: readText(body, "floor", {
      label: "Floor",
      max: 30,
      required: false,
    }),
    noiseLevel: readChoice(body, "noiseLevel", {
      label: "Noise level",
      choices: NOISE_LEVELS,
    }),
    lighting: readChoice(body, "lighting", {
      label: "Lighting",
      choices: LIGHTING_TYPES,
    }),
    features: readFeatures(body),
    capacity: readCapacity(body),
    hours: readText(body, "hours", { label: "Hours", max: 80 }),
    notes: readText(body, "notes", {
      label: "Notes",
      max: 1000,
      required: false,
    }),
    addedBy: readText(body, "addedBy", {
      label: "Your name",
      max: 60,
      required: false,
    }),
  });
}

export function spaceFilters(query) {
  return pickFilters(query, {
    building: BUILDINGS,
    noiseLevel: NOISE_LEVELS,
    lighting: LIGHTING_TYPES,
    feature: SPACE_FEATURES,
    q: null,
  });
}
