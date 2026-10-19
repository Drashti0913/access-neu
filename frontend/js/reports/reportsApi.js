import { request, toQuery } from "../shared/api.js";

export function listReports(params) {
  return request(`/api/reports${toQuery(params)}`);
}

export function saveReport(id, data) {
  return id
    ? request(`/api/reports/${id}`, { method: "PUT", body: data })
    : request("/api/reports", { method: "POST", body: data });
}

export function deleteReport(id) {
  return request(`/api/reports/${id}`, { method: "DELETE" });
}

export function resolveReport(report) {
  const { title, location, floor, category, severity, description } = report;
  return saveReport(report._id, {
    title,
    location,
    floor,
    category,
    severity,
    description,
    reporterName: report.reporterName,
    status: "resolved",
  });
}
