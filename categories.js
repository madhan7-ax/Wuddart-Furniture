// server/routes/categories.js — homepage category tiles (Living Room, Bedroom, etc).

const express = require("express");
const { readDB, writeDB } = require("../db");
const { requireAdmin } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// GET /api/categories — public.
router.get("/", (req, res) => {
  res.json(readDB().categories);
});

// POST /api/categories — admin only. Accepts multipart/form-data with an optional "image" file.
router.post("/", requireAdmin, upload.single("image"), (req, res) => {
  const db = readDB();
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const category = {
    id: req.body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    image: req.file ? "/uploads/" + req.file.filename : req.body.image || "",
  };
  db.categories.push(category);
  writeDB(db);
  res.status(201).json(category);
});

// PUT /api/categories/:id — admin only.
router.put("/:id", requireAdmin, upload.single("image"), (req, res) => {
  const db = readDB();
  const category = db.categories.find((c) => c.id === req.params.id);
  if (!category) return res.status(404).json({ error: "Category not found" });

  if (req.body.name) category.name = req.body.name;
  if (req.file) category.image = "/uploads/" + req.file.filename;
  else if (req.body.image) category.image = req.body.image;

  writeDB(db);
  res.json(category);
});

// DELETE /api/categories/:id — admin only.
router.delete("/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter((c) => c.id !== req.params.id);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
