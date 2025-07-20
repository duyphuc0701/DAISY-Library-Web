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

// --- CATEGORY DROPDOWN & FILTER LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
  // 1. Define categories array
  const categories = ["Cổ tích - thần thoại", "Văn hoá - Lịch sử", "Văn học nước ngoài", "Văn học Việt Nam"];

  // 2. Define sample books
  // Tự điền sách theo mẫu bên dưới:

  // 3. Render categories into dropdown
  const categoryMenu = document.getElementById('categoryMenu');
  if (categoryMenu) {
    categoryMenu.innerHTML = categories.map(cat => `<li><a href="#" data-category="${cat}">${cat}</a></li>`).join('');
  }

  // 4. Render books
  const main = document.querySelector('main');
  let bookListContainer = document.createElement('div');
  bookListContainer.id = 'bookList';
  main.appendChild(bookListContainer);

  function renderBooks(filteredBooks) {
    bookListContainer.innerHTML = '';
    if (filteredBooks.length === 0) {
        // Don't show warning if current filter is "Tất cả"
      if (currentCategory !== "Tất cả") {
        bookListContainer.innerHTML = '<p>Không có sách nào cho chủ đề này.</p>';
      }
      else {
        bookListContainer.innerHTML = '<p>Đang tải sách ...</p>';
      }
      return;
    }
    filteredBooks.forEach(book => {
      const card = document.createElement('div');
      card.className = 'BookCard';
      card.dataset.category = book.category;
      card.innerHTML = `
        <img src="${book.image}" alt="${book.title}" class="book-image" style="width:100px;height:auto;display:block;margin-bottom:8px;object-fit:cover;">
        <h3>${book.title}</h3>
        <p>Tác giả: ${book.author}</p>
        <p>Chủ đề: ${book.category}</p>
      `;
      card.onclick = () => goToDetail(book.id);
      bookListContainer.appendChild(card);
    });
  }

  function setupCategoryFilter() {
    if (categoryMenu) {
      categoryMenu.addEventListener('click', function (e) {
          if (e.target.tagName === 'A') {
              e.preventDefault();
              const selected = e.target.getAttribute('data-category');
              const filtered = selected === 'Tất cả'
                  ? window.books
                  : window.books.filter(book => book.category === selected);
              renderBooks(filtered);
          }
      });
    }
  }

  // 6. Hiển thị tất cả sách mặc định
  function waitForBooksAndRender() {
    if (window.books && Array.isArray(window.books)) {
        renderBooks(window.books);
        setupCategoryFilter();
    } else {
        setTimeout(waitForBooksAndRender, 100);
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
