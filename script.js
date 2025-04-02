// Array to hold all the months
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Array to hold save data
if (retrieveBookings() != null) {
  var bookings = retrieveBookings();
}

else {
  var bookings = [];
}

// Initialize current date object and current month/year variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Set the value of the month and year selectors to match their current counterparts
document.getElementById("month_name_dropdown").value = months[currentMonth];
document.getElementById("input_year").value = currentYear;

// Get the table body using DOM
let tableBody = document.getElementById("calendar_body");

// Initialize the header and calendar
updateHeader("month_name_display", currentYear, months[currentMonth]);
fillCalendarNums(tableBody, currentYear, currentMonth);

// When the "go" button is clicked, update the calendar to match the entered
// month and year. Update currentYear and currentMonth to match
document.getElementById("submit_date").onclick = function () {
  let tempYear = document.getElementById("input_year").value;
  let tempMonth = document.getElementById("month_name_dropdown").selectedIndex;

  // Update the current year and month
  currentYear = tempYear;
  currentMonth = tempMonth;

  updateHeader("month_name_display", tempYear, months[tempMonth]);
  clearCalendarRows(tableBody);
  fillCalendarNums(tableBody, tempYear, tempMonth);
};

// Setup for the bootstrap modal that prompts for a reason from user
var promptModal = new bootstrap.Modal(document.getElementById("promptModal"));
var promptModalEl = document.getElementById('promptModal');

// ====== Function Definitions ======
// Function to update the header
function updateHeader(id, year, month) {
  document.getElementById(id).innerHTML = month + ", " + year;
}

// Function to fill the calendar with rows and cells for each date
function fillCalendarNums(table, year, month) {
  // Initialize a variable to represent the day to be rendered within a cell
  let renderedDay = 1;

  // Initialize the position of the start of the month and the number of days in a month
  let startOfMonth = new Date(year, month).getDay();
  let numOfDays = 32 - new Date(year, month, 32).getDate();

  // Append 5 rows to table, each with 7 cells filled with dates
  for (let i = 0; i < 6; i++) {
    let rowTemp = table.insertRow(i);

    // If the value of renderedDay is greater than the amount of days
    // in a given month, break and do not create a new row
    if (renderedDay > numOfDays) {
      break;
    }

    for (let j = 0; j < 7; j++) {
      let cellTemp = rowTemp.insertCell(j);

      // Initialize a variable to represent the date of a cell
      let cellDate = currentYear + "-" + (currentMonth + 1) + "-" + renderedDay;

      // Check if the cell is represents the first, or subsequent day(s) of the month
      if (j + 7 * i >= startOfMonth && renderedDay <= numOfDays) {
        cellTemp.innerHTML = renderedDay;
        cellTemp.classList.add("day_of_month");
        cellTemp.appendChild(document.createElement("div"));

        // If the date of the current cell is in the bookings array,
        // update the cell accordingly
        bookings.forEach(entry => {
          if (entry[0] == cellDate) {
            cellTemp.classList.add("table-info"); // table-info is the bootstrap class I'm using for booked cells
            cellTemp.children[0].innerHTML = entry[1];
          }
        });

        // Increment the day to render
        renderedDay++;

        // Add event listener
        cellTemp.addEventListener("click", selectCell);

      } else {
        cellTemp.classList.add("empty_cell");
      }
    }
  }
}

// Function to delete all rows of the table
function clearCalendarRows(table) {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

// Function to select a cell and add a booking reason
function selectCell(e) {
  // Only process if the clicked element is a cell (not the div within the cell)
  e.stopPropagation();
  e.target.classList.add("table-info");

  // Prompt the user for a reason
  promptModal.show();

  // If the cancel button is clicked, remove the "table-info" class
  document.getElementById("cancel_booking").onclick = function () {
    // If the cell itself is clicked
    if (e.target.nodeName == "TD" && e.target.children[0].innerHTML == "") {
      e.target.classList.remove("table-info");
    }

    // If the div within the cell is clicked
    else if (e.target.nodeName == "DIV" && e.target.innerHTML == "") {
      e.target.classList.remove("table-info");
    }

    // Clear the reason text input field
    document.getElementById("reason-text").value = "";
  };

  // If the delete button is clicked, remove the "table-info" class,
  // set the innerHTML of the div to be empty, and remove the booking from
  // the array of listings
  document.getElementById("delete_booking").onclick = function () {
    // If the cell itself is clicked
    if (e.target.nodeName == "TD") {
      var selectedDate = currentYear + "-" + (currentMonth + 1) + "-" + e.target.childNodes[0].nodeValue.trim();
      e.target.classList.remove("table-info");
      e.target.children[0].innerHTML = "";
    }

    // If the div within the cell is clicked
    else if (e.target.nodeName == "DIV") {
      var selectedDate = currentYear + "-" + (currentMonth + 1) + "-" + e.target.parentNode.childNodes[0].nodeValue.trim();
      e.target.parentNode.classList.remove("table-info");
      e.target.innerHTML = "";
    }

    // Clear the reason text input field
    document.getElementById("reason-text").value = "";

    // Find and remove the entry from the array
    // then update the array
    deleteEntry(bookings, selectedDate);  
    storeBookings(bookings);
  };

  // If the submit button is clicked, add the event reason to the cell,
  // and add the date/reason to the bookings array
  document.getElementById("submit_booking").onclick = function () {
    if (e.target.nodeName == "TD") {
      let highlightedCell = e.target.children[0];
      let reason = document.getElementById("reason-text").value;
      
      // Update the slot with the reason
      highlightedCell.innerHTML = reason;

      // Append [selected date, reason] to the main bookings array
      var selectedDate = currentYear + "-" + (currentMonth + 1) + "-" + e.target.childNodes[0].nodeValue.trim();
      bookings.push([selectedDate, reason]);
      console.log(bookings);

      // Remove any older entries with similar dates
      removeDuplicates(bookings);

      console.log(bookings);

      // Clear the reason text input field
      document.getElementById("reason-text").value = "";

      // Store the current version of the bookings array
      storeBookings(bookings);
    }
  };
}

// Function to remove entries that share the same date
function removeDuplicates(array) {
  let latestDate = array[array.length - 1][0];

  for (let i = array.length - 1; i >= 0; i--) {
    if (i == array.length - 1) {continue;}

    if (array[i][0] == latestDate) {
      array.splice(i, 1);
    }
  }
}

// Function to delete an entry from bookings
function deleteEntry(array, key) {
  console.log(array, key);

  for (let i = 0; i < array.length; i++) {
    if (array[i][0] == key) {
      array.splice(i, 1);
    }
  }
}

// Function to store the array of bookings in localStorage
function storeBookings(array) {
  // Convert the array to a JSON string
  let jsonString = JSON.stringify(array);

  // Store the string in localStorage
  localStorage.setItem("save", jsonString);
}

// Function to retrieve booked dates from localStorage
function retrieveBookings() {
  // Retrieving the JSON string from localStorage
  let retrievedString = localStorage.getItem("save");

  // Convert the string back into an array and return
  return JSON.parse(retrievedString);
}