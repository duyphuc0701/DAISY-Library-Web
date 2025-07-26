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

  const qrContainer = document.getElementById("qrcode");
  console.log("qrContainer element:", qrContainer); // LOG: Kiểm tra phần tử container
  console.log("book.downloadUrl before QR code generation:", book.downloadUrl); // LOG: Giá trị URL

  if (qrContainer && book.downloadUrl && book.downloadUrl.trim() !== "") {
    qrContainer.innerHTML = ""; // Xóa nội dung hiện có trong container QR code

    try {
      // Khởi tạo một đối tượng QRCode mới
      const qrcode = new QRCode(qrContainer, {
        text: book.downloadUrl, // Dữ liệu sẽ được mã hóa vào QR code
        width: 128, // Chiều rộng của QR code (có thể điều chỉnh)
        height: 128, // Chiều cao của QR code (có thể điều chỉnh)
        colorDark: "#2f1d1dff", // Màu của các phần tử tối trong QR code
        colorLight: "#f3eeeeff", // Màu của nền sáng trong QR code
        correctLevel: QRCode.CorrectLevel.H, // Mức độ sửa lỗi (L, M, Q, H - H là cao nhất)
      });

      console.log("Mã QR đã được tạo thành công.");
    } catch (e) {
      console.error("Lỗi khi tạo mã QR:", e); // In ra lỗi nếu có
      qrContainer.innerText = "Không thể tạo mã QR (lỗi khởi tạo)."; // Hiển thị thông báo lỗi trên UI
    }
  } else if (qrContainer) {
    console.log("Không tạo mã QR vì downloadUrl không hợp lệ hoặc không có.");
    qrContainer.innerHTML = "<p>Không có đường dẫn tải xuống để tạo mã QR.</p>";
  }

  const downloadButton = document.getElementById("downloadButton");
  const spinner = document.getElementById("spinner");
  const errorMessage = document.getElementById("errorMessage");

  if (book.downloadUrl) {
    downloadButton.classList.remove("hidden");
    downloadButton.setAttribute("data-url", book.downloadUrl);

    downloadButton.addEventListener("click", async (e) => {
      e.preventDefault();
      errorMessage.classList.add("hidden");
      spinner.classList.remove("hidden");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const url = downloadButton.getAttribute("data-url");
        const head = await fetch(url, { method: "HEAD" });
        if (!head.ok) throw new Error("File not found");

        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        errorMessage.textContent = "Không tải được file. Vui lòng thử lại sau!";
        errorMessage.classList.remove("hidden");
        setTimeout(() => errorMessage.classList.add("hidden"), 2000);
      } finally {
        spinner.classList.add("hidden");
      }
    });
  }
}

async function loadBookAndRender() {
  const id = getBookIdFromUrl();
  try {
    const response = await fetch("./books.json");
    const books = await response.json();
    const book = books.find((b) => b.id === id);
    if (book) {
      renderBookDetail(book);
    } else {
      document.body.innerHTML = "<h2>Không tìm thấy sách!</h2>";
    }
  } catch (err) {
    console.error("Lỗi khi tải sách:", err);
    document.body.innerHTML = "<h2>Lỗi khi tải dữ liệu sách.</h2>";
  }
}

document.addEventListener("DOMContentLoaded", loadBookAndRender);
