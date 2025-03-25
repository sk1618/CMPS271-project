const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    spaceBetween: 40,
    grabCursor: true,


    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        }
    },
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
      clickable: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
});

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".card-follow-btn");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const nameElement = button.previousElementSibling; // Get the h3 element before the button
            if (nameElement) {
                if (nameElement.dataset.originalText === undefined) {
                    nameElement.dataset.originalText = nameElement.textContent; // Store original text
                }
                
                nameElement.textContent = 
                    nameElement.textContent === "AUB STUDENT" 
                    ? nameElement.dataset.originalText 
                    : "AUB STUDENT";
            }
        });
    });
});

