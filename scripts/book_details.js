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
  console.log("book.viewUrl before QR code generation:", book.viewUrl); // LOG: Giá trị URL

  if (qrContainer && book.viewUrl && book.viewUrl.trim() !== "") {
    qrContainer.innerHTML = ""; // Xóa nội dung hiện có trong container QR code

    try {
      // Khởi tạo một đối tượng QRCode mới
      const qrcode = new QRCode(qrContainer, {
        text: book.viewUrl, // Dữ liệu sẽ được mã hóa vào QR code
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
    console.log("Không tạo mã QR vì viewUrl không hợp lệ hoặc không có.");
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

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const url = downloadButton.getAttribute("data-url");

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank"; // open in new tab (optional)
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      spinner.classList.add("hidden");
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

function initalizeSwiper() {
    const numberOfSlides = document.querySelector('.book-wrapper').children.length;
    let swiper = new Swiper('.book-wrapper', {

        direction: 'horizontal',
        loop: true,
        spaceBetween: 30,

        // Pagination bullet
        pagination: {
            el: '.swiper-pagination',
            clickable: true,

        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive breakpoints
        breakpoints: {
            // Điều kiện để tránh bị lỗi khi slide ít 
            0: { slidesPerView: numberOfSlides > 0 ? 1 : numberOfSlides },
            768: { slidesPerView: numberOfSlides > 1 ? 2 : numberOfSlides },
            1024: { slidesPerView: numberOfSlides > 2 ? 3 : numberOfSlides },
        }
    });
}

async function renderBookCarousel(){
  const bookCarousel = document.getElementById('bookCarousel');
  bookCarousel.innerHTML = ''; // Clear existing content

  try {
    const response = await fetch("./books.json");
    if (!response.ok) throw new Error("Network response was not ok");
    const books = await response.json();
    const bookID = getBookIdFromUrl();
    const bookCategory = books.find(book => book.id === bookID).category;

    console.log("Book ID:", bookID);
    console.log("Book Category:", bookCategory); 

    books.forEach(book => {
      if (book.category === bookCategory && book.id !== bookID) {
        const div = document.createElement("div");
        div.className = "book-item swiper-slide";
        div.innerHTML = `
          <a href="book-detail.html?id=${book.id}" class="book-link">
            <img src="${book.image}" alt="${book.title}" class="book-image">
          </a>
        `;
        bookCarousel.appendChild(div);
      }
    });

    // Khởi tạo Swiper sau khi sách đã được tải và thêm vào carousel
    initalizeSwiper();

  } catch (error) {
    console.error("Lỗi khi tải sách:", error);
    bookCarousel.innerHTML = '<div class="error-message">Không thể tải sách. Vui lòng thử lại sau.</div>';
  }
}

document.addEventListener("DOMContentLoaded", loadBookAndRender);

renderBookCarousel();

// fetch("./books.json")
//     .then ( response => {
//         if ( !response.ok ) 
//             throw new Error("Network response was not ok");
//         return response.json();
//     } )
//     .then ( books => {
//         const bookCarousel = document.getElementById('bookCarousel');
//         books.forEach( book => {
//             // if ( book.category === bookCategory && book.id !== bookID ) {
//               const div = document.createElement("div");
//               div.className = "book-item swiper-slide";
//               div.innerHTML = `
//                   <a href="book-detail.html?id=${book.id}" class="book-link">
//                       <img src="${book.image}" alt="${book.title}" class="book-image">
//                   </a>
//               `;
//               bookCarousel.appendChild(div);
//             // }
//         });
        
//         // Initialize Swiper after books are loaded
//         initalizeSwiper();
//     } )
//     .catch( error => {
//         console.error("Error loading books:", error);
//         bookCarousel.innerHTML = '<div class="error-message">Failed to load books. Please try again later.</div>';
//     } );