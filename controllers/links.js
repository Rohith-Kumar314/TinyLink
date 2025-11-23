const sql = require("../db");

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateCode() {
  const chars = Math.random().toString(36).substring(2, 12)
    .replace(/[^A-Za-z0-9]/g, "");
  return chars.substring(0, Math.floor(Math.random() * 3) + 6); // 6–8 chars
}

// ===========================================================
// DASHBOARD (GET /)
// ===========================================================
module.exports.renderDashboard = async (req, res) => {
  try {
    const { search } = req.query;
    let links;

    if (search && search.trim() !== "") {
      const q = `%${search}%`;
      links = await sql`
        SELECT * FROM links
        WHERE code ILIKE ${q} OR url ILIKE ${q}
        ORDER BY id DESC
      `;
    } else {
      links = await sql`SELECT * FROM links ORDER BY id DESC`;
    }

    return res.status(200).render("pages/dashboard", {
      data: links,
      search: search || "",
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).render("pages/error", {
      message: "Failed to load dashboard",
      status: 500
    });
  }
};

// ===========================================================
// API: LIST ALL LINKS (GET /api/links)
// ===========================================================
module.exports.apiList = async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM links ORDER BY id DESC`;
    return res.status(200).json(rows);
  } catch (err) {
    console.error("API list error:", err);
    return res.status(500).render("pages/error", {
      message: "Failed to fetch links",
      status: 500
    });
  }
};

// ===========================================================
// API: GET ONE LINK (GET /api/links/:code)
// ===========================================================
module.exports.apiStats = async (req, res) => {
  try {
    const { code } = req.params;

    const rows = await sql`SELECT * FROM links WHERE code = ${code}`;

    if (rows.length === 0) {
      return res.status(404).render("pages/error", {
        message: "Link not found",
        status: 404
      });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("API stats error:", err);
    return res.status(500).render("pages/error", {
      message: "Failed to retrieve link",
      status: 500
    });
  }
};

// ===========================================================
// CREATE LINK (POST /api/links)
// ===========================================================
module.exports.createLink = async (req, res) => {
  try {
    let { url, code } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).render("pages/error", {
        message: "Please enter a valid URL",
        status: 400
      });
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      return res.status(400).render("pages/error", {
        message: "Short code must match [A-Za-z0-9]{6,8}",
        status: 400
      });
    }

    if (!code) code = generateCode();

    const exists = await sql`SELECT 1 FROM links WHERE code = ${code}`;
    if (exists.length > 0) {
      return res.status(409).render("pages/error", {
        message: "Short code already exists",
        status: 409
      });
    }

    await sql`INSERT INTO links (code, url) VALUES (${code}, ${url})`;

    return res.status(201).redirect("/");
  } catch (err) {
    console.error("Create error:", err);
    return res.status(500).render("pages/error", {
      message: "Failed to create link",
      status: 500
    });
  }
};

// ===========================================================
// STATS PAGE (GET /code/:code)
// ===========================================================
module.exports.renderStats = async (req, res) => {
  try {
    const { code } = req.params;

    const rows = await sql`SELECT * FROM links WHERE code = ${code}`;

    if (rows.length === 0) {
      return res.status(404).render("pages/error", {
        message: "Link not found",
        status: 404
      });
    }

    return res.status(200).render("pages/stats", { data: rows[0] });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).render("pages/error", {
      message: "Could not load stats page",
      status: 500
    });
  }
};

// ===========================================================
// REDIRECT (GET /:code)
// ===========================================================
module.exports.redirectLink = async (req, res) => {
  try {
    const { code } = req.params;

    const rows = await sql`SELECT * FROM links WHERE code = ${code}`;

    if (rows.length === 0) {
      return res.status(404).render("pages/error", {
        message: "Link not found",
        status: 404
      });
    }

    const link = rows[0];

    await sql`
      UPDATE links
      SET clicks = clicks + 1,
          lastclicked = NOW()
      WHERE code = ${code}
    `;

    return res.status(302).redirect(link.url); // 302
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).render("pages/error", {
      message: "Redirect failed",
      status: 500
    });
  }
};

// ===========================================================
// DELETE LINK (DELETE /api/links/:code)
// ===========================================================
module.exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;

    const result = await sql`
      DELETE FROM links WHERE code = ${code}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).render("pages/error", {
        message: "Code not found",
        status: 404
      });
    }

    return res.status(200).redirect("/");
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).render("pages/error", {
      message: "Could not delete link",
      status: 500
    });
  }
};

// ===========================================================
// HEALTH CHECK (GET /healthz)
// ===========================================================
module.exports.healthCheck = async (req, res) => {
  return res.status(200).json({
    ok: true,
    version: "1.0",
    uptime: process.uptime(),
  });
};
