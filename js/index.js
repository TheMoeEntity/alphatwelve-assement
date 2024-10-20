// Toggle sidebar visibility in mobile view
const closeBtn = document.querySelector('#closeBtn-side')
const openBtn = document.querySelector("#openBtn");
closeBtn.addEventListener('click',()=> {
  sidebar.classList.toggle("visible");
})
openBtn.addEventListener("click", () => {
  sidebar.classList.toggle("visible");
});
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
  // Add toggle functionality
  document.querySelectorAll('.collapsible-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      const collapsibleRow = trigger.closest('tr').nextElementSibling;
      const icon = trigger.querySelector('.icons');

      // Toggle the visibility of the next collapsible row
      if (collapsibleRow.classList.contains('active')) {
        collapsibleRow.classList.remove('active');
        icon.setAttribute('data-feather', 'chevron-right'); // Set icon to chevron-right
      } else {
        collapsibleRow.classList.add('active');
        icon.setAttribute('data-feather', 'chevron-down');  // Set icon to chevron-down
      }

      // Re-initialize feather icons
      feather.replace();
    });
  });