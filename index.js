const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dbUtils = require("./utils/dbutils");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const logger = require("./config/logger");
const fs = require("fs");
const path = require("path");
const authRoute = require("./routes/createAccount");
const videoRoutes = require("./routes/videofunctio");

const PORT = process.env.PORT || 3001;

dbUtils.initDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.get("/", (req, res) => {
  res.send("Welcome to the first page of the site");
});

app.use("/user", authRoute);
app.use("/api", videoRoutes);

const server = app.listen(PORT, () => {
  logger.info(`App is listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  logger.info("Received SIGINT. Closing server...");

  dbUtils.disconnectDB();

  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
});

process.on("exit", (code) => {
  logger.info(`Server exited with code ${code}`);
});
