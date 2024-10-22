// Toggle sidebar visibility in mobile view
const closeBtn = document.querySelector("#closeBtn-side");
const openBtn = document.querySelector("#openBtn");
const tableRows = document.querySelectorAll(".parent-trigger");
const closeModal = document.querySelector("#closeModal");

tableRows.forEach((row) => {
  row.addEventListener("click", () => {
    modal.classList.add("show");
    alert("Hello world");
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
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});
