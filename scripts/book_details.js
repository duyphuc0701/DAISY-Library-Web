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

    const downloadButton = document.getElementById('downloadButton');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('errorMessage');

    if (book.downloadUrl) {
        downloadButton.classList.remove('hidden');
        downloadButton.setAttribute('data-url', book.downloadUrl);

        downloadButton.addEventListener('click', async (e) => {
            e.preventDefault();
            errorMessage.classList.add('hidden');
            spinner.classList.remove('hidden');

            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const url = downloadButton.getAttribute('data-url');
                const head = await fetch(url, { method: 'HEAD' });
                if (!head.ok) throw new Error('File not found');

                const a = document.createElement('a');
                a.href = url;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                errorMessage.textContent = "Không tải được file. Vui lòng thử lại sau!";
                errorMessage.classList.remove('hidden');
                setTimeout(() => errorMessage.classList.add('hidden'), 2000);
                } finally {
                spinner.classList.add('hidden');
            }
        });
    }
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