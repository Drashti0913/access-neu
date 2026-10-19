import { request, toQuery } from "../shared/api.js";

export function listSpaces(params) {
  return request(`/api/spaces${toQuery(params)}`);
}

export function saveSpace(id, data) {
  return id
    ? request(`/api/spaces/${id}`, { method: "PUT", body: data })
    : request("/api/spaces", { method: "POST", body: data });
}

export function deleteSpace(id) {
  return request(`/api/spaces/${id}`, { method: "DELETE" });
}
