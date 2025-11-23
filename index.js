require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const engine = require("ejs-mate");

const linkRouter = require("./routes/linkRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// EJS setup
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", linkRouter);

// 404 fallback — in case no route matches
app.use((req, res) => {
  res.status(404).render("pages/notfound",{
    status:404,
    message:"No Matching URL Found"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
