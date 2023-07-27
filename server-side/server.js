const express = require('express');
const db = require('./db'); // Assuming db.js contains the updated code
const cors = require('cors')

const app = express();
const port = 3308;

app.use(cors())
// Middleware to parse JSON requests
app.use(express.json());

// Helper function to validate required fields
const validateRequiredFields = (fields) => {
  return fields.every((field) => field);
};

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const { first_name, last_name, roll_no, email, contact } = req.body;
    if (!validateRequiredFields([first_name, last_name, roll_no, email, contact])) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const result = await db.insertStudent(first_name, last_name, roll_no, email, contact);
    res.json({ msg: 'successfully added', id:result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' , error:err});
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const student = await db.getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { first_name, last_name, roll_no, email, contact } = req.body;
    if (!validateRequiredFields([first_name, last_name, roll_no, email, contact])) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const success = await db.updateStudent(id, first_name, last_name, roll_no, email, contact);
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const success = await db.deleteStudent(id);
    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
