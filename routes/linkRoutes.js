const express = require("express");
const router = express.Router();

const {
  renderDashboard,
  createLink,
  renderStats,
  redirectLink,
  deleteLink,
  healthCheck,
  apiList,
  apiStats,
} = require("../controllers/links");

// Priority routes
router.get("/healthz", healthCheck);

// API routes
router.get("/api/links", apiList);
router.get("/api/links/:code", apiStats);
router.post("/api/links", createLink);
router.delete("/api/links/:code", deleteLink);

// Stats page
router.get("/code/:code", renderStats);

// Dashboard
router.get("/", renderDashboard);

// Redirect route (LAST)
router.get("/:code", redirectLink);

module.exports = router;
