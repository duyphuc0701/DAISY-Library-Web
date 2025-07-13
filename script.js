// Toggle category dropdown
document.addEventListener('click', function(e) {
  const toggle = document.getElementById('categoryToggle');
  const menu = document.getElementById('categoryMenu');
  
  // click on the toggle button
  if (toggle.contains(e.target)) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  } else {
    // click outside: hide menu
    if (!menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  }
});
