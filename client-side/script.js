async function fetchStudents() {
    const response = await fetch(`http://localhost:3308/students`);
    return response.json();
  }

  function sanitizeHTML(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }
  

async function handleEditButtonClick(event) {
    event.preventDefault();                         
    const row = event.target.closest("tr");
    const firstNameCell = row.querySelector("td:nth-child(1)");
    const lastNameCell = row.querySelector("td:nth-child(2)");
    const rollNoCell = row.querySelector("td:nth-child(3)");
    const emailCell = row.querySelector("td:nth-child(4)");
    const contactCell = row.querySelector("td:nth-child(5)");
  
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
      lastNameCell.textContent= newLastName;
      rollNoCell.textContent= newRollNo;
      emailCell.textContent= newEmail;
      contactCell.textContent = newContact;
  
      // Show the "Edit" button again
      row.querySelector(".edit").textContent = "Edit";
  
      row.classList.remove("edit-mode");
      showMessage("Data has been updated!", "success");

// Send the updated data to the server
const studentId = row.dataset.studentId;
const response = await fetch(`http://localhost:3308/students/${studentId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: newFirstName,
    last_name: newLastName,
    roll_no: newRollNo,
    email: newEmail,
    contact: newContact
  })
});

if (response.ok) {
  showMessage("Data has been updated on the server!", "success");
} else {
  showMessage("An error occurred while updating the student on the server.", "error");
}

    } else {
      // Enter edit mode
      row.classList.add("edit-mode");
  
      // Change the "Edit" button to "Save"
      row.querySelector(".edit").textContent = "Save";
  
      // Create input fields with the current data
      row.querySelector(
        "td:nth-child(1)"
      ).innerHTML = `<input class="edit-firstName" type="text" value="${firstName}">`;
      row.querySelector(
        "td:nth-child(2)"
      ).innerHTML = `<input class="edit-lastName" type="text" value="${lastName}">`;
      row.querySelector(
        "td:nth-child(3)"
      ).innerHTML = `<input class="edit-rollNo" type="number" value="${rollNo}">`;
      row.querySelector(
        "td:nth-child(4)"
      ).innerHTML = `<input class="edit-email" type="email" value="${email}">`;
      row.querySelector(
        "td:nth-child(5)"
      ).innerHTML = `<input class="edit-contact" type="text" value="${contact}">`;

    const contactInput = document.createElement("input");
    contactInput.setAttribute("type", "text");
    contactInput.classList.add("edit-contact");
    contactInput.value = contact;
    contactInput.maxLength = 10; // Set the maximum length to 10 characters
    row.querySelector("td:nth-child(5)").innerHTML = "";
    row.querySelector("td:nth-child(5)").appendChild(contactInput);
  
    }
  }
  
  function handleDeleteButtonClick(event) {
    event.preventDefault();
    const deleteButton =event.target;
    const row = deleteButton.closest("tr");
    const firstName = row.querySelector("td:nth-child(1)").textContent;
    const lastName = row.querySelector("td:nth-child(2)").textContent;
    const rollNo = row.querySelector("td:nth-child(3)").textContent;
    const email = row.querySelector("td:nth-child(4)").textContent;
    const contact = row.querySelector("td:nth-child(5)").textContent;
  
    const confirmation = confirm(
      `Are you sure you want to delete this record?\nFirst Name: ${firstName}\nLast Name: ${lastName}\nRoll No: ${rollNo}\nEmail: ${email}\nContact: ${contact}`
    );
    console.log(confirmation);
    if (confirmation) {
      const studentId = row.dataset.studentId;
      const response = fetch(`http://localhost:3308/students/${studentId}`,{
        method:'DELETE',
      })
      .then(response => {
        if (response.ok) {
          // Remove the row from the table on successful deletion
          row.remove();
          showMessage("Deleted Successfully", "success");
        } else {
          // Handle errors if the delete request was not successful
          showMessage("An error occurred while deleting the student.", "error");
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error("Error occurred while deleting student:", error);
        showMessage("An error occurred while deleting the student. Please try again later.", "error");
      });
  }
}

  
  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const firstName = form.querySelector(".first_name").value;
    const lastName = form.querySelector(".last_name").value;
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

    const response = await fetch('http://localhost:3308/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      roll_no: rollNo,
      email: email,
      contact: contact
    })
  });
setTimeout(() => {
  if(response.ok){
  showMessage("Data has been added successfully!", "success");

  form.reset();

  fetchAndRenderStudents();
  } else {
    showMessage("An error occurred. Please try again later.", "error");
  }  
},1000);
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
        newRow.dataset.studentId = student.id;
        newRow.innerHTML = `
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
  });
  
  