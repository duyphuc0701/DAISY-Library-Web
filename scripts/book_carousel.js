function initalizeSwiper() {
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
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        }
    });
}


fetch("./books.json")
    .then ( response => {
        if ( !response.ok ) 
            throw new Error("Network response was not ok");
        return response.json();
    } )
    .then ( books => {
        const bookCarousel = document.getElementById('bookCarousel');
        books.forEach( book => {
            const div = document.createElement("div");
            div.className = "book-item swiper-slide";
            div.innerHTML = `
                <a href="book-detail.html?id=${book.id}" class="book-link">
                    <img src="${book.image}" alt="${book.title}" class="book-image">
                </a>
            `;
            bookCarousel.appendChild(div);
        });
        // Initialize Swiper after books are loaded
        initalizeSwiper();
    } )
    .catch( error => {
        console.error("Error loading books:", error);
        bookCarousel.innerHTML = '<div class="error-message">Failed to load books. Please try again later.</div>';
    } );