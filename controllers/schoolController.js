const db = require("../config/db");
const calculateDistance = require("../utils/distance");

const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, address, latitude, longitude"
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

const listSchools = (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({
      success: false,
      message: "Enter vaild latutude and longitude"
    });
  }

  const sql = "SELECT * FROM schools";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching schools",
        error: err.message
      });
    }

    const sortedSchools = results
      .map((school) => {
        const distance = calculateDistance(
          userLat,
          userLon,
          school.latitude,
          school.longitude
        );

        return {
          ...school,
          distance: Number(distance.toFixed(2))
        };
      })
      .sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      count: sortedSchools.length,
      data: sortedSchools
    });
  });
};

module.exports = { addSchool, listSchools };