const db = require("../config/db");

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
//validatoin
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (
    typeof name !== "string" ||
    typeof address !== "string" ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data types provided"
    });
  }

  if (Number(latitude) < -90 || Number(latitude) > 90) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be between -90 and 90"
    });
  }

  if (Number(longitude) < -180 || Number(longitude) > 180) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be between -180 and 180"
    });
  }

  const sql =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error adding school",
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "School added successfully",
      schoolId: result.insertId
    });
  });
};

module.exports = { addSchool };