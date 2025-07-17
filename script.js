const books = [
  {
    id: 1,
    title: "Harry Potter và Hòn đá Phù thủy",
    cover:
      "https://sachnoi.cc/wp-content/uploads/2021/08/Sach-Noi-Harry-Potter-Tap-1-J-K-Rowling-audio-book-sachnoi.cc-4.jpg",
    description: "Cuộc phiêu lưu đầu tiên của cậu bé phù thủy Harry Potter.",
    author: "J.K. Rowling",
    publisher: "Bloomsbury",
    year: 1997,
    category: "Fantasy",
  },
  {
    id: 2,
    title: "One Piece",
    cover:
      "https://cdn0.fahasa.com/media/catalog/product/t/i/tieu_thuyet_one_piece_film_red_-_bia_ao_kem_obi.jpg",
    description: "Cuộc hành trình trở thành Vua Hải Tặc của Monkey D. Luffy.",
    author: "Eiichiro Oda",
    publisher: "Shueisha",
    year: 1997,
    category: "Manga",
  },
  {
    id: 3,
    title: "Sherlock Holmes: Những cuộc phiêu lưu",
    cover:
      "https://cdn0.fahasa.com/media/catalog/product/8/9/8936067590491.jpg",
    description: "Những vụ án ly kỳ của thám tử Sherlock Holmes.",
    author: "Arthur Conan Doyle",
    publisher: "NXB Văn Học",
    year: 1892,
    category: "Trinh thám",
  },
  {
    id: 4,
    title: "Đắc Nhân Tâm",
    cover:
      "https://cdn0.fahasa.com/media/catalog/product/9/7/9786049222996.jpg",
    description: "Cuốn sách kỹ năng sống bán chạy nhất mọi thời đại.",
    author: "Dale Carnegie",
    publisher: "NXB Tổng Hợp TP.HCM",
    year: 1936,
    category: "Kỹ năng sống",
  },
  {
    id: 5,
    title: "Dế Mèn Phiêu Lưu Ký",
    cover:
      "https://cdn0.fahasa.com/media/catalog/product/8/9/8935244817710.jpg",
    description: "Chuyến phiêu lưu của chú dế mèn nổi tiếng văn học Việt Nam.",
    author: "Tô Hoài",
    publisher: "NXB Kim Đồng",
    year: 1941,
    category: "Thiếu nhi",
  },
];

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

// Render danh sách sách ở trang index.html
function renderBookList() {
  const bookList = document.getElementById("book-list");
  if (!bookList) return; // không có thì thoát
  // Duyệt qua mảng books và tạo từng thẻ sách
  //...
  //// Style cơ bản cho mỗi thẻ sách
  ////...
  //// Tạo giao diện ảnh + tiêu đề sách
  ////...
  //// Khi click vào sách, chuyển trang chi tiết
  div.onclick = () => goToDetail(book.id);
  //// Thêm thẻ sách vào danh sách sách
  ////...
}

// Tự động render danh sách sách khi vào trang index.html
if (document.getElementById("book-list")) {
  renderBookList();
}
