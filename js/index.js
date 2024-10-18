// Toggle sidebar visibility in mobile view
const closeBtn = document.querySelector('#closeBtn-side')
closeBtn.addEventListener('click',()=> {
  sidebar.classList.toggle("visible");
})
document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("visible");
});
document.getElementById('collapseBtn').addEventListener('click', function() {
  const sidebar = document.getElementById('sidebar');
  const content = document.querySelector('.content');
  
  sidebar.classList.toggle('collapsed');
  content.classList.toggle('collapsed');
});