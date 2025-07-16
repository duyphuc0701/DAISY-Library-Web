// Toggle category dropdown
document.addEventListener('click', function(e) {
  const toggle = document.getElementById('categoryToggle');
  const menu = document.getElementById('categoryMenu');
  // click on the toggle button
  if (toggle && toggle.contains(e.target)) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  } else {
    // click outside: hide menu
    if (menu && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  }
});

// --- CATEGORY DROPDOWN & FILTER LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
  // 1. Define categories array
  const categories = ["Cổ tích - thần thoại", "Văn hoá - Lịch sử", "Văn học nước ngoài", "Văn học Việt Nam"];

  // 2. Define sample books
  // Tự điền sách theo mẫu bên dưới:
  const books = [
    // { title: "", author: "", category: "", image: "" },
    { title: "Sự tích dưa hấu",           author: "Nguyễn Đổng Chi",   category: "Cổ tích - thần thoại",  image: "image/co_tich_than_thoai/sutichduahau.jpg" },
    { title: "Sự tích trầu, cau và vôi",  author: "Nguyễn Đổng Chi",   category: "Cổ tích - thần thoại",  image: "image/co_tich_than_thoai/sutichtraucauvoi.jpg" },
    { title: "Búp sen xanh",              author: "Sơn Tùng",          category: "Văn hoá - Lịch sử",     image: "image/van_hoa_lich_su/bupsenxanh.jpg" },
    { title: "Cơ sở văn hoá Việt Nam",    author: "Trần Ngọc Thêm",    category: "Văn hoá - Lịch sử",     image: "image/van_hoa_lich_su/cosovanhoaVN.png" },
    { title: "Không gia đình",            author: "Hector Malot",      category: "Văn học nước ngoài",    image: "image/van_hoc_nuoc_ngoai/khonggiadinh.png" },
    { title: "Phù thuỷ xứ OZ",            author: "Frank Baum",        category: "Văn học nước ngoài",    image: "image/van_hoc_nuoc_ngoai/phuthuyxuoz.png" },
    { title: "Số đỏ",                     author: "Vũ Trọng Phụng",    category: "Văn học Việt Nam",      image: "image/van_hoc_Viet_Nam/sodo.png" },
    { title: "Tắt đèn",                   author: "Ngô Tất Tố",        category: "Văn học Việt Nam",      image: "image/van_hoc_Viet_Nam/tatden.png" }

  ];

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
      bookListContainer.innerHTML = '<p>Không có sách nào cho chủ đề này.</p>';
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
      bookListContainer.appendChild(card);
    });
  }

  // 5. Add click event to filter BookCards
  if (categoryMenu) {
    categoryMenu.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const selected = e.target.getAttribute('data-category');
        const filtered = books.filter(book => book.category === selected);
        renderBooks(filtered);
      }
    });
  }

  // 6. Hiển thị tất cả sách mặc định
  renderBooks(books);
});
