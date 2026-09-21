const express = require("express");

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const router = express.Router();

// Create student
router.post("/", createStudent);

// Get all students
router.get("/", getAllStudents);

// Get one student
router.get("/:id", getStudentById);

// Update student
router.patch("/:id", updateStudent);

// Delete student
router.delete("/:id", deleteStudent);

module.exports = router;