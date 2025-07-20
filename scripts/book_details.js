function getBookIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

function renderBookDetail(book) {
    document.getElementById("book-title").innerText = book.title;
    document.getElementById("book-author").innerText = book.author;
    document.getElementById("book-publisher").innerText = book.publisher;
    document.getElementById("book-year").innerText = book.year;
    document.getElementById("book-category").innerText = book.category;
    document.getElementById("book-description").innerText = book.description;
    document.getElementById("book-cover").src = book.image;
}

async function loadBookAndRender() {
    const id = getBookIdFromUrl();
    try {
    const response = await fetch('./books.json');
    const books = await response.json();
    const book = books.find(b => b.id === id);
    if (book) {
        renderBookDetail(book);
    } else {
        document.body.innerHTML = '<h2>Không tìm thấy sách!</h2>';
    }
    } catch (err) {
    console.error("Lỗi khi tải sách:", err);
    document.body.innerHTML = '<h2>Lỗi khi tải dữ liệu sách.</h2>';
    }
}

document.addEventListener("DOMContentLoaded", loadBookAndRender);