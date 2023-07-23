// Fetch students data from the server
async function fetchStudents() {
  try {
    const response = await fetch('http://localhost:3308/students');
    return response.json();
  } catch (error) {
    throw new Error('Error retrieving students. Please try again.');
  }
}

// Function to handle the "Edit" button click
function handleEditButtonClick(event) {
  event.preventDefault();
  const row = event.target.closest("tr");
  const id = row.querySelector("td:nth-child(1)").textContent; // Get the ID from the first table cell

  const firstNameCell = row.querySelector("td:nth-child(2)");
  const lastNameCell = row.querySelector("td:nth-child(3)");
  const rollNoCell = row.querySelector("td:nth-child(4)");
  const emailCell = row.querySelector("td:nth-child(5)");
  const contactCell = row.querySelector("td:nth-child(6)");

  const firstName = firstNameCell.textContent;
  const lastName = lastNameCell.textContent;
  const rollNo = rollNoCell.textContent;
  const email = emailCell.textContent;
  const contact = contactCell.textContent;

  // Check if the row is already in edit mode
  if (row.classList.contains("edit-mode")) {
    // Save the edited data
    const newFirstName = row.querySelector(".edit-firstName").value;
    const newLastName = row.querySelector(".edit-lastName").value;
    const newRollNo = row.querySelector(".edit-rollNo").value;
    const newEmail = row.querySelector(".edit-email").value;
    const newContact = row.querySelector(".edit-contact").value;

    if (
      newFirstName.trim() === "" ||
      newLastName.trim() === "" ||
      newRollNo.trim() === "" ||
      newEmail.trim() === "" ||
      newContact.trim() === ""
    ) {
      showMessage("Please fill in all the fields before saving.", "error");
      return;
    }

    firstNameCell.textContent = newFirstName;
    lastNameCell.textContent = newLastName;
    rollNoCell.textContent = newRollNo;
    emailCell.textContent = newEmail;
    contactCell.textContent = newContact;

    // Show the "Edit" button again
    row.querySelector(".edit").textContent = "Edit";

    row.classList.remove("edit-mode");
    showMessage("Data has been updated!", "success");

    // Update the student data on the server
    updateStudentDataInServer(id, {
      first_name: newFirstName,
      last_name: newLastName,
      roll_no: newRollNo,
      email: newEmail,
      contact: newContact,
    })
      .then(() => {
        showMessage("Data has been updated!", "success");
      })
      .catch((error) => {
        console.error(error);
        showMessage("Error updating student data. Please try again.", "error");
      });
  } else {
    // Enter edit mode
    row.classList.add("edit-mode");

    // Change the "Edit" button to "Save"
    row.querySelector(".edit").textContent = "Save";

    // Create input fields with the current data, including the ID as a hidden field
    row.querySelector(
      "td:nth-child(2)"
    ).innerHTML = `<input class="edit-firstName" type="text" value="${firstName}">`;
    row.querySelector(
      "td:nth-child(3)"
    ).innerHTML = `<input class="edit-lastName" type="text" value="${lastName}">`;
    row.querySelector(
      "td:nth-child(4)"
    ).innerHTML = `<input class="edit-rollNo" type="number" value="${rollNo}">`;
    row.querySelector(
      "td:nth-child(5)"
    ).innerHTML = `<input class="edit-email" type="email" value="${email}">`;
    row.querySelector(
      "td:nth-child(6)"
    ).innerHTML = `<input class="edit-contact" type="text" value="${contact}">`;
  }
}

async function updateAllStudents(updatedFields) {
  try {
    // Fetch all students from the server
    const students = await fetchStudents();

    // Update each student with the provided fields
    await Promise.all(
      students.map((student) =>
        updateStudentDataInServer(student.id, updatedFields)
      )
    );

    return true; // Return true for successful update
  } catch (error) {
    console.error(error);
    throw new Error('Error updating all students. Please try again.');
  }
}


// Function to update a student by ID in the database
async function updateStudentById(id, updatedFields) {
  try {
    await updateStudentDataInServer(id, updatedFields);
    return true; // Return true for successful update
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating student with ID ${id}. Please try again.`);
  }
}

// Function to update student data on the server using Promise
async function updateStudentDataInServer(id, updatedFields) {
  try {
    const response = await fetch(`http://localhost:3308/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      throw new Error(`Failed to update student with ID ${id}.`);
    }

    return response.json(); // Return response data
  } catch (error) {
    console.error(error);
    throw new Error(`Error updating student with ID ${id}. Please try again.`);
  }
}

// Function to handle the "Delete" button click
function handleDeleteButtonClick(event) {
  event.preventDefault();
  const row = event.target.closest("tr");
  const id = row.querySelector("td:nth-child(1)").textContent;
  const firstName = row.querySelector("td:nth-child(2)").textContent;
  const lastName = row.querySelector("td:nth-child(3)").textContent;
  const rollNo = row.querySelector("td:nth-child(4)").textContent;
  const email = row.querySelector("td:nth-child(5)").textContent;
  const contact = row.querySelector("td:nth-child(6)").textContent;

  const confirmation = confirm(
    `Are you sure you want to delete this record?\nID: ${id}\nFirst Name: ${firstName}\nLast Name: ${lastName}\nRoll No: ${rollNo}\nEmail: ${email}\nContact: ${contact}`
  );
  if (confirmation) {
    row.remove();
    deleteStudentFromServer(id)
      .then(() => {
        showMessage("Deleted Successfully", "success");
      })
      .catch((error) => {
        console.error(error);
        showMessage("Error deleting student. Please try again.", "error");
      });
  }
}

function deleteStudentFromServer(id) {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3308/students/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          resolve(true); // Resolve with true for successful deletion
        } else {
          response.json().then(errorMessage => {
            reject(new Error(errorMessage.message || `Failed to delete student with ID ${id}.`));
          });
        }
      })
      .catch(error => {
        console.error(error);
        reject(new Error(`Error deleting student with ID ${id}. Please try again.`));
      });
  });
}


// Function to update student data on the server
async function updateStudentDataInServer(row) {
  const firstName = row.querySelector(".edit-firstName").value;
  const lastName = row.querySelector(".edit-lastName").value;
  const rollNo = row.querySelector(".edit-rollNo").value;
  const email = row.querySelector(".edit-email").value;
  const contact = row.querySelector(".edit-contact").value;

  try {
    await fetch(`http://localhost:3308/students/${rollNo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        roll_no: rollNo,
        email: email,
        contact: contact,
      }),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error updating student data. Please try again.");
  }
}

async function updateStudentById(id, updatedFields) {
  try {
    const response = await fetch(`http://localhost:3308/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFields)
    });
    return response.json();
  } catch (error) {
    throw new Error(`Error updating student with ID ${id}. Please try again.`);
  }
}

function handleDeleteAllButtonClick(event) {
  event.preventDefault();
  const confirmation = confirm("Are you sure you want to delete all records?");
  if (confirmation) {
    deleteAllStudentsFromServer()
      .then(() => {
        const tableBody = document.querySelector(".personal-details");
        tableBody.innerHTML = '';
        showMessage("All records have been deleted successfully!", "success");
      })
      .catch((error) => {
        console.error(error);
        showMessage("Error deleting all students. Please try again.", "error");
      });
  }
}
// Function to handle "Delete by ID" button click
function handleDeleteByIdButtonClick(event) {
  event.preventDefault();
  const idInput = document.querySelector(".delete-by-id-input");
  const id = idInput.value.trim();

  if (!id) {
    showMessage("Please enter an ID before deleting.", "error");
    return;
  }

  const confirmation = confirm(`Are you sure you want to delete the record with ID: ${id}?`);
  if (confirmation) {
    deleteStudentFromServer(id)
      .then(() => {
        const rowToDelete = document.querySelector(`td:nth-child(1):contains(${id})`).parentNode;
        rowToDelete.remove();
        showMessage(`Record with ID ${id} has been deleted successfully!`, "success");
      })
      .catch((error) => {
        console.error(error);
        showMessage(`Error deleting student with ID ${id}. Please try again.`, "error");
      });
  }
}

// Function to handle the form submission
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const firstName = form.querySelector(".firstName").value;
  const lastName = form.querySelector(".lastName").value;
  const rollNo = form.querySelector(".roll_no").value;
  const email = form.querySelector(".email").value;
  const contact = form.querySelector(".contact").value;

  // Validation: Check if any of the input fields is empty
  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    rollNo.trim() === "" ||
    email.trim() === "" ||
    contact.trim() === ""
  ) {
    showMessage("Please fill in all the fields before submitting.", "error");
    return;
  }

  // Add the new student to the server
  addStudentToServer(firstName, lastName, rollNo, email, contact)
    .then(() => {
      // Create a new table row with the input values
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${student.id}</td>
        <td>${firstName}</td>
        <td>${lastName}</td>
        <td>${rollNo}</td>
        <td>${email}</td>
        <td>${contact}</td>
        <td>
          <div class="action-buttons">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        </td>
      `;

      // Attach event listeners to the new row's buttons
      newRow.querySelector(".edit").addEventListener("click", handleEditButtonClick);
      newRow.querySelector(".delete").addEventListener("click", handleDeleteButtonClick);

      // Append the new row to the table body
      const tableBody = document.querySelector(".personal-details");
      tableBody.appendChild(newRow);

      // Clear the form after adding the row
      form.reset();

      // Show a success message for adding
      showMessage("Data has been added Successfully!", "success");
    })
    .catch((error) => {
      console.error(error);
      showMessage("Error adding student. Please try again.", "error");
    });
}

async function addStudentToServer() {
  const response = await fetch('http://localhost:3308/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      roll_no: RollNo,
      email: email,
      contact: contact,
    }),
  });

  if (!response.ok) {
    // Check if the response status is not successful (2xx status codes)
    throw new Error('Failed to add student.');
  }

  const data = await response.json();
  return data; // Return the response data
}

// Function to show a message to the user
function showMessage(message, messageType) {
  const messageContainer = document.querySelector(".message-container");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.classList.add("message", messageType);
  messageContainer.appendChild(messageElement);

  // Remove the message after a few seconds
  setTimeout(() => {
    messageElement.remove();
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("personal");
  form.addEventListener("submit", handleSubmit);

  // Event listener to handle contact number character limit
  const rollNoInput = form.querySelector(".contact");
  rollNoInput.addEventListener("input", function (event) {
    const maxCharacters = 10;
    const currentValue = event.target.value;
    if (currentValue.length > maxCharacters) {
      event.target.value = currentValue.slice(0, maxCharacters);
    }
  });

  // Event listener to handle minimum characters for contact number
  rollNoInput.addEventListener("blur", function (event) {
    const minCharacters = 10;
    const currentValue = event.target.value;
    if (currentValue.length < minCharacters) {
      showMessage(`Contact number must be at least ${minCharacters} characters.`, "error");
    }
  });

  const editButtons = document.querySelectorAll(".action-buttons button.edit");
  const deleteButtons = document.querySelectorAll(".action-buttons button.delete");

  editButtons.forEach(function (button) {
    button.addEventListener("click", handleEditButtonClick);
  });

  deleteButtons.forEach(function (button) {
    button.addEventListener("click", handleDeleteButtonClick);
  });

  // Fetch and render students
  async function fetchAndRenderStudents() {
    try {
      const students = await fetchStudents();
      const tableBody = document.querySelector(".personal-details");
      tableBody.innerHTML = ''; // Clear the table body
      students.forEach(student => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${student.id}</td>
          <td>${student.first_name}</td>
          <td>${student.last_name}</td>
          <td>${student.roll_no}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td>
            <div class="action-buttons">
              <button class="edit">Edit</button>
              <button class="delete">Delete</button>
            </div>
          </td>
        `;
        tableBody.appendChild(newRow);

        const editButton = newRow.querySelector("button.edit");
        const deleteButton = newRow.querySelector("button.delete");
        editButton.addEventListener("click", handleEditButtonClick);
        deleteButton.addEventListener("click", handleDeleteButtonClick);
      });
    } catch (error) {
      showMessage('Error retrieving students. Please try again.', 'error');
    }
  }

  fetchAndRenderStudents();
});
