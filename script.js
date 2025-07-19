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

// Download button functionality
const downloadButton = document.querySelector('.downloadButton');
const spinner = document.querySelector('.spinner');
const errorMessage = document.querySelector('.errorMessage');
const url = downloadButton.getAttribute('data-url');

downloadButton.addEventListener('click', async e => {
  e.preventDefault();
  errorMessage.classList.add('hidden');
  spinner.classList.remove('hidden');

  // Simulate a delay to show the spinner
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Throw an error if the URL is not valid
    const head = await fetch(url, { method: 'HEAD' });
    if (!head.ok) throw new Error('File not found');

    // Activate download
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch(error) {
    errorMessage.textContent = "Không tải được file. Vui lòng thử lại sau!";
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 2000);
  } finally {
    spinner.classList.add('hidden');
  }
})