// const books = [
//     // { title: "", author: "", category: "", image: "" },
//     {id: 1, title: "Sự tích dưa hấu",           author: "Nguyễn Đổng Chi",   category: "Cổ tích - thần thoại",  image: "image/co_tich_than_thoai/sutichduahau.jpg", year: 2023, publisher: "NXB Kim Đồng", description: "Một câu chuyện cổ tích thú vị về nguồn gốc của dưa hấu." },
//     {id: 2, title: "Sự tích trầu, cau và vôi",  author: "Nguyễn Đổng Chi",   category: "Cổ tích - thần thoại",  image: "image/co_tich_than_thoai/sutichtraucauvoi.jpg", year: 2023, publisher: "NXB Kim Đồng", description: "Câu chuyện giải thích nguồn gốc của trầu, cau và vôi trong văn hoá Việt Nam." },
//     {id: 3, title: "Búp sen xanh",              author: "Sơn Tùng",          category: "Văn hoá - Lịch sử",     image: "image/van_hoa_lich_su/bupsenxanh.jpg", year: 2023, publisher: "NXB Văn Học", description: "Một tác phẩm nổi tiếng về văn hoá và lịch sử Việt Nam." },
//     {id: 4, title: "Cơ sở văn hoá Việt Nam",    author: "Trần Ngọc Thêm",    category: "Văn hoá - Lịch sử",     image: "image/van_hoa_lich_su/cosovanhoaVN.png", year: 2023, publisher: "NXB Chính Trị Quốc Gia", description: "Cuốn sách cung cấp cái nhìn sâu sắc về văn hoá Việt Nam." },
//     {id: 5, title: "Không gia đình",            author: "Hector Malot",      category: "Văn học nước ngoài",    image: "image/van_hoc_nuoc_ngoai/khonggiadinh.png", year: 2023, publisher: "NXB Kim Đồng", description: "Một tác phẩm kinh điển của văn học Pháp về tình cảm gia đình." },
//     {id: 6, title: "Phù thuỷ xứ OZ",            author: "Frank Baum",        category: "Văn học nước ngoài",    image: "image/van_hoc_nuoc_ngoai/phuthuyxuoz.png", year: 2023, publisher: "NXB Kim Đồng", description: "Cuốn sách kể về cuộc phiêu lưu của cô bé Dorothy ở xứ Oz." },
//     {id: 7, title: "Số đỏ",                     author: "Vũ Trọng Phụng",    category: "Văn học Việt Nam",      image: "image/van_hoc_Viet_Nam/sodo.png", year: 2023, publisher: "NXB Văn Học", description: "Một tác phẩm nổi tiếng của văn học hiện đại Việt Nam, phê phán xã hội thượng lưu." },
//     {id: 8, title: "Tắt đèn",                   author: "Ngô Tất Tố",        category: "Văn học Việt Nam",      image: "image/van_hoc_Viet_Nam/tatden.png", year: 2023, publisher: "NXB Văn Học", description: "Cuốn tiểu thuyết nổi tiếng về cuộc sống của người nông dân Việt Nam trong thời kỳ phong kiến." },

// ];

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
        categoryToggle.textContent = selected + ' ▾';
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
    bookListContainer.innerHTML = '';

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

    bookListContainer.appendChild(row);
  }

  /*
  function setupCategoryFilter() {
    if (categoryMenu) {
      categoryMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          const selected = e.target.getAttribute('data-category');
          currentCategory = selected; // Cập nhật giá trị đã chọn
          const filtered = selected === 'Tất cả'
            ? window.books
            : window.books.filter(book => book.category === selected);
          renderBooks(filtered);
        }
      });
    }
  }
  */

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
