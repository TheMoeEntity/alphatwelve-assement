const eventName = document.getElementById("event-name");
const eventDate = document.querySelector("#event-date");
const eventDetails = document.querySelector("#event-details");
const eventSpeakers = document.querySelector("#event-speakers");
const eventCount = document.querySelector("#attendee-count");
let currEvent = {}; // This will hold the current event's data
let eventData = [];
let currentPage = 1; // Track the current page
const rowsPerPage = 10; // Number of rows per page

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
      const selectedEvent = data[eventIndex]; // Get the selected event data

      // Set the modal content with the event details
      eventName.innerHTML = selectedEvent.eventName;
      eventDate.innerHTML = selectedEvent.date;
      eventDetails.innerHTML = selectedEvent.eventDescription;
      eventSpeakers.innerHTML = `${selectedEvent.attendees.length} Guest Speakers: ${selectedEvent.speakers.join(", ")}`;
      eventCount.innerHTML = selectedEvent.attendees.length + " Attendees";

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
