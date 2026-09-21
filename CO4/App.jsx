import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const emptyStudent = {
    name: "",
    age: "",
    course: "",
    email: "",
  };

  const [student, setStudent] = useState(emptyStudent);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // GET all students
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/students");
      const data = await response.json();

      if (response.ok) {
        setStudents(data);
      }
    } catch (error) {
      setMessage("❌ Cannot connect to backend.");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ADD student
  const addStudent = async () => {
    try {
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: student.name,
          age: Number(student.age),
          course: student.course,
          email: student.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Student added successfully!");
        setStudent(emptyStudent);
        getStudents();
      } else {
        setMessage("❌ " + (data.message || "Failed to add student"));
      }
    } catch (error) {
      setMessage("❌ Cannot connect to backend.");
    }
  };

  // Start EDIT
  const startEdit = (item) => {
    setEditingId(item._id);

    setStudent({
      name: item.name,
      age: item.age,
      course: item.course,
      email: item.email,
    });

    setMessage("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // UPDATE student
  const updateStudent = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/students/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: student.name,
            age: Number(student.age),
            course: student.course,
            email: student.email,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Student updated successfully!");
        setEditingId(null);
        setStudent(emptyStudent);
        getStudents();
      } else {
        setMessage("❌ " + (data.message || "Failed to update student"));
      }
    } catch (error) {
      setMessage("❌ Cannot connect to backend.");
    }
  };

  // DELETE student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Student deleted successfully!");

        if (editingId === id) {
          setEditingId(null);
          setStudent(emptyStudent);
        }

        getStudents();
      } else {
        setMessage("❌ " + (data.message || "Failed to delete student"));
      }
    } catch (error) {
      setMessage("❌ Cannot connect to backend.");
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setStudent(emptyStudent);
    setMessage("");
  };

  return (
    <div className="app">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <div className="header-icon">🎓</div>

          <h1>Student Records</h1>

          <p>
            Student Records Management System
          </p>
        </div>

        {/* FORM CARD */}
        <div className="card">

          <div className="card-title">
            <h2>
              {editingId ? "✏️ Edit Student" : "➕ Add Student"}
            </h2>

            <span>
              {editingId ? "Update student details" : "Enter student details"}
            </span>
          </div>

          <div className="form-group">
            <label>Student Name</label>

            <input
              name="name"
              placeholder="Enter student name"
              value={student.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Age</label>

            <input
              name="age"
              type="number"
              placeholder="Enter age"
              value={student.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Course</label>

            <input
              name="course"
              placeholder="Enter course"
              value={student.course}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Enter email"
              value={student.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">

            {editingId ? (
              <>
                <button
                  className="update-button"
                  onClick={updateStudent}
                >
                  ✓ Update Student
                </button>

                <button
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="add-button"
                onClick={addStudent}
              >
                + Add Student
              </button>
            )}

          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

        </div>

        {/* STUDENT RECORDS */}
        <div className="students-section">

          <div className="section-header">
            <div>
              <h2>📋 Student Records</h2>
              <p>All registered students</p>
            </div>

            <div className="student-count">
              {students.length} Students
            </div>
          </div>

          {students.length === 0 ? (
            <div className="no-students">
              <div className="empty-icon">📭</div>
              <h3>No students found</h3>
              <p>Add a student using the form above.</p>
            </div>
          ) : (
            <div className="student-list">

              {students.map((item, index) => (
                <div
                  className="student-card"
                  key={item._id}
                >

                  <div className="student-number">
                    {index + 1}
                  </div>

                  <div className="student-info">

                    <h3>{item.name}</h3>

                    <div className="student-details">

                      <span>
                        <strong>Age:</strong> {item.age}
                      </span>

                      <span>
                        <strong>Course:</strong> {item.course}
                      </span>

                      <span>
                        <strong>Email:</strong> {item.email}
                      </span>

                    </div>

                  </div>

                  <div className="actions">

                    <button
                      className="edit-button"
                      onClick={() => startEdit(item)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteStudent(item._id)}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;