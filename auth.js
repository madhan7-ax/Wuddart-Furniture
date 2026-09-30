// server/middleware/auth.js — simple shared-key check for admin-only routes.
// Change the key in server/data/db.json ("adminKey") or set an ADMIN_KEY env var.

const { readDB } = require("../db");

function requireAdmin(req, res, next) {
  const db = readDB();
  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY || db.settings.adminKey;
  if (key && key === expected) return next();
  return res.status(401).json({ error: "Invalid or missing admin key" });
}

module.exports = { requireAdmin };
