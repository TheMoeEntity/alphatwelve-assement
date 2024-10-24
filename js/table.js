import { Helpers } from "./Helpers.js";
const eventName = document.getElementById("event-name");
const eventDate = document.querySelector("#event-date");
const eventDetails = document.querySelector("#event-details");
const eventSpeakers = document.querySelector("#event-speakers");
const eventCount = document.querySelector("#attendee-count");
const markBtn = document.querySelector("#mark");
const rowsPerPageSelect = document.getElementById("rows-per-page");
const searchBar = document.querySelector("#search");
const totalRows = document.querySelector("#totalRows");
const sortSelect = document.getElementById("sort-select");
const exportBtn = document.getElementById("export-btn");

let eventData = [];
let currentPage = 1; // Track the current page
let rowsPerPage = 10; // Number of rows per page
let currIndex = null;

//Sorting functionality
sortSelect.addEventListener("change", (e) => {
  const sortValue = e.target.value;
  sortEvents(sortValue);
});

//export functionality
exportBtn.addEventListener("click", function () {
  exportToExcel(eventData);
});

rowsPerPageSelect.addEventListener("change", (e) => {
  rowsPerPage = parseInt(e.target.value); // Update rowsPerPage based on the selected value
  totalRows.textContent = rowsPerPage;
  currentPage = 1; // Reset to the first page after changing rows per page
  const totalPages = Math.ceil(eventData.length / rowsPerPage); // Recalculate total pages
  populateTableWithPagination(eventData, currentPage); // Re-populate the table
  setupPagination(totalPages); // Re-setup pagination with the new number of rows per page
});

// search functionality
searchBar.addEventListener("input", (e) => {
  const keyword = e.target.value;
  e.target.style.outline = "none";
  const filteredEvents = eventData.filter((item) =>
    item.eventName.toLowerCase().includes(keyword.toLowerCase())
  );
  populateTableWithPagination(filteredEvents, currentPage);
});

// Fetch and populate the table with pagination
async function fetchAndPopulateTable() {
  feather.replace();
  try {
    const response = await fetch("/data/events.json");
    eventData = await response.json();

    // Calculate the total number of pages
    const totalPages = Math.ceil(eventData.length / rowsPerPage);

    // Call the function to populate the table and set up pagination
    populateTableWithPagination(eventData, currentPage);
    setupPagination(totalPages);
  } catch (error) {
    console.error("Error fetching the event data:", error);
  }
}

// Function to populate the table with pagination
function populateTableWithPagination(data, page) {
  const tableBody = document.getElementById("event-table-body");
  tableBody.innerHTML = ""; // Clear existing content

  // Calculate the start and end indices for the current page
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach((event, index) => {
    const speakers = event.speakers.join(", ");

    // Main row
    const mainRow = `
      <tr>
        <td>
          <div>
            <span class="collapsible-trigger">
              <i class="icons" data-feather="chevron-right"></i>
            </span>
            <span class="parent-trigger" data-index="${start + index}">${event.eventName}</span>
          </div>
        </td>
        <td class="mobile-hidden">${event.date}</td>
        <td class="mobile-hidden">${speakers}</td>
        <td>
          <span class="${event.status === "Completed" ? "completed" : "progress"}">
          <span class="${event.status === "Completed" ? "completed" : "progress"}"></span> 
          ${event.status}
          </span>
        </td>
      </tr>`;

    // Collapsible row (Only visible on mobile)
    const collapsibleRow = `
      <tr class="mobile-visible collapsible-content">
        <td>
          <div><span>${event.attendees[0]}</span></div>
        </td>
        <td class="mobile-hidden">${speakers}</td>
        <td class="mobile-hidden">${event.date}</td>
        <td>${event.date}</td>
      </tr>`;

    // Append rows to the table body
    tableBody.innerHTML += mainRow + collapsibleRow;
  });
  // Add event listeners to the table rows for modal triggering
  const tableRows = document.querySelectorAll(".parent-trigger");
  const modal = document.querySelector("#modal");

  tableRows.forEach((row) => {
    row.addEventListener("click", (event) => {
      const eventIndex = event.target.getAttribute("data-index");
      currIndex = eventIndex;
      const selectedEvent = data[eventIndex]; // Get the selected event data

      // Set the modal content with the event details
      eventName.innerHTML = selectedEvent.eventName;
      eventDate.innerHTML = selectedEvent.date;
      eventDetails.innerHTML = selectedEvent.eventDescription;
      eventSpeakers.innerHTML = `${selectedEvent.attendees.length} Guest Speakers: ${selectedEvent.speakers.join(", ")}`;
      eventCount.innerHTML = selectedEvent.attendees.length + " Attendees";
      markBtn.innerHTML =
        selectedEvent.status.toLowerCase() == "completed"
          ? "Mark as in-progress"
          : "Mark as Completed";

      // Show the modal
      modal.classList.add("show");
    });
  });

  // Add toggle functionality for collapsible rows
  document.querySelectorAll(".collapsible-trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const collapsibleRow = trigger.closest("tr").nextElementSibling;
      const icon = trigger.querySelector(".icons");

      // Toggle the visibility of the next collapsible row
      if (collapsibleRow.classList.contains("active")) {
        collapsibleRow.classList.remove("active");
        icon.setAttribute("data-feather", "chevron-right"); // Set icon to chevron-right
      } else {
        collapsibleRow.classList.add("active");
        icon.setAttribute("data-feather", "chevron-down"); // Set icon to chevron-down
      }

      // Re-initialize feather icons after the dynamic change
      feather.replace();
    });
  });
  deleteAction();
  markAction();
  feather.replace();
  //   setupRowListeners();
}

// Function to set up the pagination buttons
function setupPagination(totalPages) {
  const paginationContainer = document.querySelector("#table-btns");
  paginationContainer.innerHTML = ""; // Clear existing buttons

  // Create the "prev" button
  const prevButton = document.createElement("button");
  prevButton.classList.add("prev");
  prevButton.innerHTML =
    '<i class="fas fa-angle-left" style="color: black"></i>';
  prevButton.addEventListener("click", () =>
    changePage(currentPage - 1, totalPages)
  );
  paginationContainer.appendChild(prevButton);

  // Create page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("div");
    pageButton.textContent = i;

    // Add the "active" class only when the current page matches
    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    pageButton.addEventListener("click", () => changePage(i, totalPages));
    paginationContainer.appendChild(pageButton);
  }

  // Create the "next" button
  const nextButton = document.createElement("button");
  nextButton.classList.add("next");
  nextButton.innerHTML =
    '<i class="fas fa-angle-right" style="color: black"></i>';
  nextButton.addEventListener("click", () =>
    changePage(currentPage + 1, totalPages)
  );
  paginationContainer.appendChild(nextButton);
}

// Function to handle page change
function changePage(page, totalPages) {
  if (page < 1 || page > totalPages) return; // Prevent invalid page changes
  currentPage = page;
  populateTableWithPagination(eventData, currentPage);
  setupPagination(totalPages); // Re-render the pagination buttons with the correct "active" state
}

// Call the fetch function on page load
fetchAndPopulateTable();
const deleteAction = () => {
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.querySelector("#modal");
      const selectedEvent = eventData[currIndex];
      modal.classList.remove("show");
      showConfirmBox(
        "Do you want to delete this item?",
        function (isConfirmed) {
          if (isConfirmed) {
            console.log("User confirmed action!");
            const filteredEvents = eventData.filter(
              (item) => item !== selectedEvent
            );
            eventData = filteredEvents;
            populateTableWithPagination(eventData, currentPage);
            totalRows.textContent = eventData.length;
          }
        }
      );
    });
  });
};
const markAction = () => {
  document.querySelectorAll(".mark").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.querySelector("#modal");
      const selectedEvent = eventData[currIndex];
      const status = selectedEvent.status;
      modal.classList.remove("show");
      showConfirmBox(
        `Do you want to mark this event as ${
          status.toLowerCase() == "completed" ? "In-progress" : "Completed"
        }`,
        function (isConfirmed) {
          if (isConfirmed) {
            console.log("User confirmed action!");
            const filteredEvents = eventData.map((item) =>
              item == selectedEvent
                ? {
                    ...item,
                    status:
                      status.toLowerCase() == "completed"
                        ? "In Progress"
                        : "Completed",
                  }
                : item
            );
            eventData = filteredEvents;
            populateTableWithPagination(eventData, currentPage);
          }
        }
      );
    });
  });
};

const showConfirmBox = (message, callback) => {
  const confirmBox = document.getElementById("confirm-box");
  const confirmMessage = document.getElementById("confirm-message");
  const confirmYesButton = document.getElementById("confirm-yes");
  const confirmNoButton = document.getElementById("confirm-no");

  // Set the message dynamically
  confirmMessage.textContent = message;

  // Display the confirm box
  confirmBox.classList.remove("hidden");

  // Handle the 'Yes' button click
  confirmYesButton.onclick = function () {
    confirmBox.classList.add("hidden");
    callback(true); // Execute the callback with 'true'
  };

  // Handle the 'No' button click
  confirmNoButton.onclick = function () {
    confirmBox.classList.add("hidden");
    callback(false); // Execute the callback with 'false'
  };
};
const sortEvents = (sortValue) => {
  let sortedData = [...eventData];

  if (sortValue === "most-recent") {
    // Sort by most recent date (assuming date is in a format JavaScript can parse)
    sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === "oldest") {
    // Sort by oldest date
    sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === "alphabetical") {
    // Sort alphabetically by event name
    sortedData.sort((a, b) => a.eventName.localeCompare(b.eventName));
  } else if (sortValue === "in-progress") {
    // Filter only 'In Progress' events
    sortedData = sortedData.filter(
      (event) => event.status.toLowerCase() === "in progress"
    );
  } else if (sortValue === "completed") {
    // Filter only 'Completed' events
    sortedData = sortedData.filter(
      (event) => event.status.toLowerCase() === "completed"
    );
  }

  populateTableWithPagination(sortedData, currentPage);
  setupPagination(Math.ceil(sortedData.length / rowsPerPage));
};
const exportToExcel = (data) => {
  // Convert eventData into an array of arrays suitable for Excel
  const formattedData = data.map((event) => [
    event.eventName, // Event name
    event.date, // Date
    event.speakers.join(", "), // Speakers
    event.status, // Status
    event.attendees.length, // Number of attendees
  ]);

  // Add a header row
  formattedData.unshift([
    "Event Name",
    "Date",
    "Speakers",
    "Status",
    "Attendees",
  ]);

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(formattedData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

  // Create the Excel file and trigger download
  XLSX.writeFile(workbook, "EventData.xlsx");
};
