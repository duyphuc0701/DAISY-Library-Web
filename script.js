// Toggle category dropdown
document.addEventListener("click", function (e) {
  const toggle = document.getElementById("categoryToggle");
  const menu = document.getElementById("categoryMenu");

  // click on the toggle button
  if (toggle.contains(e.target)) {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  } else {
    // click outside: hide menu
    if (!menu.contains(e.target)) {
      menu.style.display = "none";
    }
  }
});

// Chuyển sang trang chi tiết sách với id được truyền vào
function goToDetail(id) {
  window.location.href = `book-detail.html?id=${id}`;
}

// Lấy id sách từ URL của trang chi tiết
function getBookIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// Render chi tiết sách khi vào trang book-detail.html
function renderBookDetail() {
  const id = getBookIdFromUrl();
  const book = books.find((b) => b.id === id);
  // Nếu không tìm thấy sách, hiển thị thông báo lỗi
  if (!book) {
    document.getElementById("book-detail").innerHTML =
      "<h2>Không tìm thấy sách!</h2>";
    return;
  }

  // Đổ dữ liệu sách vào các phần tử HTML tương ứng
  document.getElementById("book-title").innerText = book.title;
  document.getElementById("book-cover").src = book.cover;
  document.getElementById("book-description").innerText = book.description;
  document.getElementById("book-author").innerText = book.author;
  document.getElementById("book-publisher").innerText = book.publisher;
  document.getElementById("book-year").innerText = book.year;
  document.getElementById("book-category").innerText = book.category;
}

// Khi vào trang book-detail.html sẽ tự động render chi tiết sách
if (window.location.pathname.includes("book-detail.html")) {
  renderBookDetail();
}
