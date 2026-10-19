import { ObjectId } from "mongodb";
import { getDb } from "./connection.js";
import { escapeRegex } from "./pagination.js";

const COLLECTION = "quiet_spaces";

function spaces() {
  return getDb().collection(COLLECTION);
}

export async function createIndexes() {
  await spaces().createIndexes([
    { key: { building: 1 } },
    { key: { noiseLevel: 1, lighting: 1 } },
    { key: { features: 1 } },
  ]);
}

function buildFilter({ building, noiseLevel, lighting, feature, q }) {
  const filter = {};
  if (building) filter.building = building;
  if (noiseLevel) filter.noiseLevel = noiseLevel;
  if (lighting) filter.lighting = lighting;
  if (feature) filter.features = feature;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: pattern }, { notes: pattern }];
  }
  return filter;
}

export async function listSpaces(query, { skip, limit }) {
  const filter = buildFilter(query);
  const [items, total] = await Promise.all([
    spaces()
      .find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    spaces().countDocuments(filter),
  ]);
  return { items, total };
}

export async function getSpace(id) {
  return spaces().findOne({ _id: new ObjectId(id) });
}

export async function createSpace(data) {
  const now = new Date();
  const doc = { ...data, createdAt: now, updatedAt: now };
  const result = await spaces().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function updateSpace(id, data) {
  return spaces().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteSpace(id) {
  const result = await spaces().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function insertManySpaces(docs) {
  await spaces().deleteMany({});
  return spaces().insertMany(docs);
}
