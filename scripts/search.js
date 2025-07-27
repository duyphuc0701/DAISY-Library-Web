
/**
 * @param {string} pattern The pattern string.
 * @returns {Map<string, number>} A Map where keys are characters and values are their shift amounts.
 */
function buildBadCharTable(pattern) {
    const table = new Map();
    const M = pattern.length;
    for (let i = 0; i < 256; i++) {
        table.set(String.fromCharCode(i), M);
    }

    for (let i = 0; i < M - 1; i++) {
        table.set(pattern[i], M - 1 - i);
    }
    return table;
}

/**
 * @param {string} text The text to search within.
 * @param {string} pattern The pattern to search for.
 * @returns {boolean} True if the pattern is found in the text, false otherwise.
 */
function boyerMooreSearch(text, pattern) {
    const N = text.length;
    const M = pattern.length;

    if (M === 0) return true;
    if (N === 0 || M > N) return false;

    const badCharTable = buildBadCharTable(pattern);

    let s = 0;
    while (s <= (N - M)) {
        let j = M - 1;
        while (j >= 0 && pattern[j] === text[s + j]) {
            j--;
        }

        if (j < 0) {
            return true;
        } else {
            const charToShift = text[s + M - 1];
            const shiftAmount = badCharTable.get(charToShift) || M;
            s += shiftAmount;
        }
    }
    return false;
}

function showLoading() {
    document.getElementById('searchButton').classList.add('loading');
    document.getElementById('loadingIndicator').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('searchButton').classList.remove('loading');
    document.getElementById('loadingIndicator').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const bookListContainer = document.getElementById('bookList'); // Match category.js
    const noResultsMessage = document.getElementById('noResultsMessage');
    const categoryMenu = document.getElementById('categoryMenu');
    const categoryToggle = document.getElementById('categoryToggle');

    let allBooks = [];
    let currentSearchTerm = '';
    let currentCategory = 'Tất cả';

    function renderBookCards(booksToRender) {
        bookListContainer.innerHTML = '';
        if (booksToRender.length === 0) {
            noResultsMessage.style.display = 'block';
            noResultsMessage.textContent = 'Không có kết quả tìm kiếm.';
        } else {
            noResultsMessage.style.display = 'none';
            const row = document.createElement('div');
            row.className = 'row g-4';

            booksToRender.forEach(book => {
            const col = document.createElement('div');
            col.className = 'col-12 col-sm-6 col-md-4 col-lg-3'; // Bootstrap grid

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
    }

    async function fetchBooks() {
        showLoading();
        try {
            const response = await fetch('./books.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            allBooks = await response.json();
            window.books = allBooks;
            populateCategories();
            renderBookCards(allBooks);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sách:', error);
            noResultsMessage.textContent = 'Không thể tải dữ liệu sách. Vui lòng thử lại sau.';
            noResultsMessage.style.display = 'block';
        } finally {
            hideLoading();
        }
    }

    function filterAndRenderBooks() {
        showLoading();
        setTimeout(() => {
            const searchTerm = currentSearchTerm.toLowerCase().trim();
            const filteredBooks = allBooks.filter(book => {
                const titleText = (book.title || '').toLowerCase();
                const authorText = (book.author || '').toLowerCase();
                const publisherText = (book.publisher || '').toLowerCase();
                const categoryText = (book.category || '').toLowerCase();
                const searchMatch = !searchTerm || (
                    boyerMooreSearch(titleText, searchTerm) ||
                    boyerMooreSearch(authorText, searchTerm) ||
                    boyerMooreSearch(publisherText, searchTerm)
                );
                const categoryMatch = (currentCategory === 'Tất cả' || categoryText === currentCategory.toLowerCase());
                return searchMatch && categoryMatch;
            });
            renderBookCards(filteredBooks);
            hideLoading();
        }, 500);
    }

    searchButton.addEventListener('click', () => {
        currentSearchTerm = searchInput.value;
        filterAndRenderBooks();
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });

    function populateCategories() {
        const categories = new Set();
        allBooks.forEach(book => {
            if (book.category) categories.add(book.category);
        });

        categoryMenu.innerHTML = '';
        const allItem = document.createElement('li');
        const allLink = document.createElement('a');
        allLink.href = "#";
        allLink.textContent = "Tất cả";
        allLink.dataset.category = "Tất cả";
        allLink.addEventListener('click', handleCategoryClick);
        allItem.appendChild(allLink);
        categoryMenu.appendChild(allItem);

        const sortedCategories = Array.from(categories).sort();
        sortedCategories.forEach(category => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = "#";
            link.textContent = category;
            link.dataset.category = category;
            link.addEventListener('click', handleCategoryClick);
            listItem.appendChild(link);
            categoryMenu.appendChild(listItem);
        });
    }

    function handleCategoryClick(event) {
        event.preventDefault();
        document.getElementById('pageHeading').textContent = event.target.textContent;
        currentCategory = event.target.dataset.category;
        filterAndRenderBooks();
    }

    document.addEventListener('click', function (e) {
        const menu = document.getElementById('categoryMenu');
        const toggle = document.getElementById('categoryToggle');
        if (toggle && toggle.contains(e.target)) {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        } else {
            if (menu && !menu.contains(e.target) && menu.style.display === 'block') {
                menu.style.display = 'none';
            }
        }
    });

    categoryToggle.addEventListener('click', function () {
        const menu = document.getElementById('categoryMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    fetchBooks();
});