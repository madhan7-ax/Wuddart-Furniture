// server/routes/products.js — the product catalogue (no prices; enquiry-based).

const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../db");
const { requireAdmin } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();

// GET /api/products — public. Supports ?category=&q=&status= filters.
router.get("/", (req, res) => {
  const db = readDB();
  let list = db.products;
  const { category, q, status } = req.query;

  if (category) list = list.filter((p) => p.category === category);
  if (status) list = list.filter((p) => p.status === status);
  if (q) {
    const term = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }
  res.json(list);
});

// GET /api/products/:id — public.
router.get("/:id", (req, res) => {
  const db = readDB();
  const item = db.products.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Product not found" });
  res.json(item);
});

// POST /api/products — admin only. Accepts multipart/form-data with an optional "image" file.
router.post("/", requireAdmin, upload.single("image"), (req, res) => {
  const db = readDB();
  const { name, category, description, status } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: "name and category are required" });
  }

  const product = {
    id: "p" + crypto.randomUUID().slice(0, 8),
    name,
    category,
    description: description || "",
    status: status || "Available",
    image: req.file ? "/uploads/" + req.file.filename : req.body.image || "",
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(product);
  writeDB(db);
  res.status(201).json(product);
});

// PUT /api/products/:id — admin only.
router.put("/:id", requireAdmin, upload.single("image"), (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { name, category, description, status, image } = req.body;
  if (name) product.name = name;
  if (category) product.category = category;
  if (description !== undefined) product.description = description;
  if (status) product.status = status;
  if (req.file) product.image = "/uploads/" + req.file.filename;
  else if (image) product.image = image;

  writeDB(db);
  res.json(product);
});

// DELETE /api/products/:id — admin only.
router.delete("/:id", requireAdmin, (req, res) => {
  const db = readDB();
  db.products = db.products.filter((p) => p.id !== req.params.id);
  writeDB(db);
  res.status(204).end();
});

module.exports = router;
