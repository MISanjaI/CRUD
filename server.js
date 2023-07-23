const express = require('express');
const db = require('./db'); 

const app = express();
const port = 3308;

app.use(express.json());


const validateRequiredFields = (fields) => {
  return fields.every((field) => field);
};


// Create a new student or multiple students
app.post('/students', async (req, res) => {
  try {
    const studentsData = req.body;

    if (!Array.isArray(studentsData)) {
      return res.status(400).json({ message: 'Invalid request data. Expected an array of student objects.' });
    }

    const invalidStudents = studentsData.filter((student) => !validateRequiredFields(Object.values(student)));
    if (invalidStudents.length > 0) {
      return res.status(400).json({ message: 'Please provide all required fields for each student.' });
    }

    const insertedIds = [];
    for (const student of studentsData) {
      const { first_name, last_name, roll_no, email, contact } = student;
      const result = await db.insertStudent(first_name, last_name, roll_no, email, contact);
      insertedIds.push(result);
    }

    res.json({ insertedIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await db.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedFields = req.body;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'Please provide at least one field to update.' });
    }

      const success = await db.updateStudent(id, updatedFields);

    if (!success) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student information updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/students', async (req, res) => {
  try {
    const result = await db.deleteAllStudents();

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No students found to delete' });
    }

    res.json({ message: 'All students deleted successfully' });
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
