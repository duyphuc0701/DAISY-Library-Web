let currentCategory = "Tất cả";
let books = [];

// --- CATEGORY DROPDOWN & FILTER LOGIC ---
document.addEventListener('DOMContentLoaded', async function() {
  // 1. Define categories array
  const categories = ["Cổ tích - thần thoại", "Văn hoá - Lịch sử", "Văn học nước ngoài", "Văn học Việt Nam"];
  try {
    const res = await fetch('./books.json');
    books = await res.json();
  } catch (err) {
    console.error("Lỗi khi tải books.json:", err);
    document.getElementById('bookList').innerHTML = "<p>Không thể tải dữ liệu sách.</p>";
    return;
  }

  // 2. Define sample books
  // Tự điền sách theo mẫu bên dưới:

  // 3. Render categories vào dropdown
  const categoryMenu = document.getElementById('categoryMenu');
  const categoryToggle = document.getElementById('categoryToggle');

  if (categoryMenu) {
    categoryMenu.innerHTML = categories.map(cat =>
      `<li><a href="#" data-category="${cat}">${cat}</a></li>`
    ).join('');
  }

    // Gán lại sự kiện sau khi render
  function bindCategoryClickEvents() {
    categoryMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const selected = e.target.getAttribute('data-category');
        currentCategory = selected;

        // Lọc sách
        const filtered = selected === 'Tất cả'
          ? window.books
          : window.books.filter(book => book.category === selected);

        renderBooks(filtered);

        // Cập nhật nhãn dropdown và ẩn menu
        categoryMenu.style.display = 'none';
      });
    });
  }

  // Hiển thị dropdown khi bấm nút
  categoryToggle.addEventListener('click', function (e) {
    e.preventDefault();
    categoryMenu.style.display = (categoryMenu.style.display === 'block') ? 'none' : 'block';
  });

  // Đóng menu khi click ra ngoài
  document.addEventListener('click', function (e) {
    if (!categoryToggle.contains(e.target) && !categoryMenu.contains(e.target)) {
      categoryMenu.style.display = 'none';
    }
  });
  // 4. Render books
  const bookListContainer = document.getElementById('bookList');

  function renderBooks(filteredBooks) {
    if (filteredBooks.length === 0) {
      bookListContainer.innerHTML = `<p class="text-muted">Không có sách nào cho chủ đề này.</p>`;
      return;
    }

    const row = document.createElement('div');
    row.className = 'row g-4';

    filteredBooks.forEach(book => {
      const col = document.createElement('div');
      col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0">
          <img src="${book.image}" class="card-img-top" alt="${book.title}" style="object-fit: cover; height: 220px;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text text-muted mb-1"><strong>Tác giả:</strong> ${book.author}</p>
            <p class="card-text text-muted mb-1"><strong>NXB:</strong> ${book.publisher}</p>
            <p class="card-text text-muted"><strong>Chủ đề:</strong> ${book.category}</p>
            <a href="book-detail.html?id=${book.id}" class="mt-auto btn btn-primary btn-sm">Xem chi tiết</a>
          </div>
        </div>
      `;

      row.appendChild(col);
    });
    bookListContainer.innerHTML = '';
    bookListContainer.appendChild(row);
  }

  function waitForBooksAndRender() {
    if (window.books && Array.isArray(window.books)) {
      renderBooks(window.books);
      //setupCategoryFilter();
      bindCategoryClickEvents();
    } else {
      setTimeout(waitForBooksAndRender, 10);
    }
  }

  waitForBooksAndRender();

  
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
  document.getElementById("book-cover").src = book.image;
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
