// server/routes/settings.js — site-wide settings (tagline, contact info, warranty text, etc).

const express = require("express");
const { readDB, writeDB } = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/settings — public. Never exposes the admin key.
router.get("/", (req, res) => {
  const db = readDB();
  const { adminKey, ...publicSettings } = db.settings;
  res.json(publicSettings);
});

// PUT /api/settings — admin only. Merges the given fields into the existing settings.
router.put("/", requireAdmin, (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body, adminKey: db.settings.adminKey };
  writeDB(db);
  const { adminKey, ...publicSettings } = db.settings;
  res.json(publicSettings);
});

module.exports = router;
