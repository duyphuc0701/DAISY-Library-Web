// Mảng chứa danh sách sách (Task 1)
const books = [
  {
    id: 1,
    title: "Những Người Khốn Khổ",
    author: "Victor Hugo",
    coverURL: "https://example.com/covers/les-miserables.jpg",
    shortDesc: "Tiểu thuyết kinh điển về cuộc đấu tranh của con người trong xã hội bất công.",
    publisher: "Nhà Xuất Bản Văn Học",
    year: 1862,
    category: "Tiểu thuyết",
    detailURL: "https://docs.google.com/spreadsheets/d/1ot_Jr3xdhyUefVr1QZuCeCBiBsVYrVq3S07VCqcBz0A/view?gid=1519412063"
  },
  {
    id: 2,
    title: "Truyện Kiều",
    author: "Nguyễn Du",
    coverURL: "https://example.com/covers/truyen-kieu.jpg",
    shortDesc: "Tác phẩm thơ nổi tiếng kể về cuộc đời nàng Kiều, đầy bi kịch và nhân văn.",
    publisher: "Nhà Xuất Bản Kim Đồng",
    year: 1820,
    category: "Thơ",
    detailURL: "https://docs.google.com/spreadsheets/d/1ot_Jr3xdhyUefVr1QZuCeCBiBsVYrVq3S07VCqcBz0A/view?gid=1519412063"
  },
  {
    id: 3,
    title: "Số Đỏ",
    author: "Vũ Trọng Phụng",
    coverURL: "https://example.com/covers/so-do.jpg",
    shortDesc: "Tiểu thuyết châm biếm sâu sắc về xã hội Việt Nam thời kỳ giao thời.",
    publisher: "Nhà Xuất Bản Hội Nhà Văn",
    year: 1936,
    category: "Tiểu thuyết",
    detailURL: "https://docs.google.com/spreadsheets/d/1ot_Jr3xdhyUefVr1QZuCeCBiBsVYrVq3S07VCqcBz0A/view?gid=1519412063"
  },
  {
    id: 4,
    title: "Tắt Đèn",
    author: "Ngô Tất Tố",
    coverURL: "https://example.com/covers/tat-den.jpg",
    shortDesc: "Tiểu thuyết hiện thực phê phán xã hội Việt Nam thời kỳ phong kiến.",
    publisher: "Nhà Xuất Bản Văn Học",
    year: 1939,
    category: "Tiểu thuyết",
    detailURL: "https://docs.google.com/spreadsheets/d/1ot_Jr3xdhyUefVr1QZuCeCBiBsVYrVq3S07VCqcBz0A/view?gid=1519412063"
  },
  {
    id: 5,
    title: "Lão Hạc",
    author: "Nam Cao",
    coverURL: "https://example.com/covers/lao-hac.jpg",
    shortDesc: "Truyện ngắn hiện thực về số phận người nông dân nghèo trong xã hội cũ.",
    publisher: "Nhà Xuất Bản Văn Học",
    year: 1943,
    category: "Truyện ngắn",
    detailURL: "https://docs.google.com/spreadsheets/d/1ot_Jr3xdhyUefVr1QZuCeCBiBsVYrVq3S07VCqcBz0A/view?gid=1519412063"
  }
];

// Hàm tạo BookCard từ template (Task 2)
function createBookCard(book) {
  const template = document.getElementById('bookCardTemplate');
  if (!template) {
    console.error('Template #bookCardTemplate not found');
    return null;
  }

  const card = document.importNode(template.content, true).querySelector('.book-card');
  if (!card) {
    console.error('Element .book-card not found in template');
    return null;
  }

  const cover = card.querySelector('.book-cover');
  const category = card.querySelector('.book-category');
  const titleLink = card.querySelector('.book-title-link');
  const title = card.querySelector('.book-title');
  const author = card.querySelector('.book-author');
  const desc = card.querySelector('.book-desc');
  const publisher = card.querySelector('.publisher');
  const year = card.querySelector('.year');

  if (!cover || !category || !titleLink || !title || !author || !desc || !publisher || !year) {
    console.error('One or more elements not found in .book-card:', {
      cover, category, titleLink, title, author, desc, publisher, year
    });
    return null;
  }

  cover.src = book.coverURL;
  cover.alt = `Bìa sách ${book.title} của ${book.author}`;
  category.textContent = book.category;
  titleLink.textContent = book.title;
  titleLink.href = book.detailURL || `/book/${book.id}`; // Dùng detailURL nếu có, nếu không dùng /book/:id
  title.id = `book-title-${book.id}`;
  author.textContent = book.author;
  desc.textContent = book.shortDesc;
  publisher.textContent = book.publisher;
  year.textContent = book.year;
  card.setAttribute('aria-labelledby', `book-title-${book.id}`);

  return card;
}

// Hàm render danh sách sách (Task 3)
function renderBookList(filteredBooks = books) {
  const bookGrid = document.getElementById('bookGrid');
  if (!bookGrid) {
    console.error('Element #bookGrid not found');
    return;
  }

  bookGrid.innerHTML = ''; // Xóa nội dung cũ
  filteredBooks.forEach(book => {
    const card = createBookCard(book);
    if (card) {
      bookGrid.appendChild(card);
    }
  });
}

// Toggle category dropdown
document.addEventListener('click', function(e) {
  const toggle = document.getElementById('categoryToggle');
  const menu = document.getElementById('categoryMenu');

  if (toggle && toggle.contains(e.target)) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  } else if (menu && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }

  if (e.target.classList.contains('category-item')) {
    e.preventDefault();
    const selectedCategory = e.target.dataset.category;
    const filteredBooks = selectedCategory === 'all' 
      ? books 
      : books.filter(book => book.category === selectedCategory);
    renderBookList(filteredBooks);
    menu.style.display = 'none';
  }
});

// Gọi hàm render và tạo menu danh mục khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  const categories = ['all', ...new Set(books.map(book => book.category))];
  const categoryMenu = document.getElementById('categoryMenu');
  if (categoryMenu) {
    categoryMenu.innerHTML = categories.map(cat => 
      `<li><a href="#" class="category-item" data-category="${cat}">${cat === 'all' ? 'Tất cả' : cat}</a></li>`
    ).join('');
  } else {
    console.error('Element #categoryMenu not found');
  }

  renderBookList();
});