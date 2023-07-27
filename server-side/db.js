const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '5002186',
  database: 'students',
  connectionLimit: 10,
  multipleStatements: true,
});
  
function executeQuery(sql, values) {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return reject(error);
      }
      resolve(results);
    });
  });
}

async function getAllStudents() {
  try {
    const query = 'SELECT * FROM students';
    const students = await executeQuery(query);
    return students;
  } catch (error) {
    throw error;
  }
}

async function insertStudent(firstName, lastName, rollNo, email, contact) {
  try {
    const query = 'INSERT INTO students (first_name, last_name, roll_no, email, contact) VALUES (?, ?, ?, ?, ?)';
    const result = await executeQuery(query, [firstName, lastName, rollNo, email, contact]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
}

async function updateStudent(id, firstName, lastName, rollNo, email, contact) {
  try {
    const query =
      'UPDATE students SET first_name = ?, last_name = ?, roll_no = ?, email = ?, contact = ? WHERE id = ?';
    await executeQuery(query, [firstName, lastName, rollNo, email, contact, id]);
    return true;
  } catch (error) {
    throw error;
  }
}

async function deleteAllStudents() {
  try {
    const query = 'TRUNCATE TABLE students';
    await executeQuery(query);
    return true;
  } catch (error) {
    throw error;
  }
}


async function deleteStudent(id) {
  try {
    const query = 'DELETE FROM students WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllStudents,
  insertStudent,
  updateStudent,
  deleteStudent,
  deleteAllStudents
};
