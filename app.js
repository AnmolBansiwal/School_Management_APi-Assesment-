require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const schoolRoutes = require("./routes/schoolRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("School Management API is running");
});

app.use("/", schoolRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});