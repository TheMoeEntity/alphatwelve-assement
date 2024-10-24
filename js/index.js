// Toggle sidebar visibility in mobile view
const closeBtn = document.querySelector("#closeBtn-side");
const openBtn = document.querySelector("#openBtn");
const tableRows = document.querySelectorAll(".parent-trigger");
const closeModal = document.querySelector("#closeModal");
// const splide = new Splide(".splide").mount();
document.addEventListener("DOMContentLoaded", () => {
  // Function to animate the number countdown
  function animateNumbers(element, start, end, duration) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = current.toLocaleString(); // Display the number with commas (e.g., 100,000)
      if (current === end) {
        clearInterval(timer); // Stop the timer when the number reaches the end
      }
    }, stepTime);
  }

  // Function to start the countdown after 2 seconds
  function startCountdown() {
    const totalEventsElement = document.querySelector(".card:nth-child(1) b");
    const activeSpeakersElement = document.querySelector(
      ".card:nth-child(2) b"
    );
    const totalRegistrationsElement = document.querySelector(
      ".card:nth-child(3) b"
    );
    const totalRevenueElement = document.querySelector(".card:nth-child(4) b");

    // Animate each number with a countdown effect
    animateNumbers(totalEventsElement, 0, 1000, 2000); // 100,000 total events
    animateNumbers(activeSpeakersElement, 0, 25, 2000); // 25 active speakers
    animateNumbers(totalRegistrationsElement, 0, 300, 2000); // 300 total registrations
    animateNumbers(totalRevenueElement, 0, 5000, 2000); // $500,000 total revenue
  }

  // Start the countdown 2 seconds after page load
  setTimeout(startCountdown, 2000);
});
tableRows.forEach((row) => {
  row.addEventListener("click", () => {
    modal.classList.add("show");
  });
});
closeBtn.addEventListener("click", () => {
  sidebar.classList.toggle("visible");
});
openBtn.addEventListener("click", () => {
  sidebar.classList.toggle("visible");
});
closeModal.addEventListener("click", () => {
  modal.classList.remove("show");
});
document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});
document.getElementById("collapseBtn").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  const content = document.querySelector(".content");

  sidebar.classList.toggle("collapsed");
  content.classList.toggle("collapsed");
  splide.refresh();
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

