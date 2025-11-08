document.addEventListener("DOMContentLoaded", () => {
    const accordionItems = document.querySelectorAll(".accordion__item")

    accordionItems.forEach((el) => {
        el.style.maxHeight = `${el.querySelector(".accordion__item-title").clientHeight + 32}px`
        el.addEventListener("click", () => {
            if (!el.classList.contains("accordion__item--active")) {
                el.closest(".accordion").querySelectorAll(".accordion__item").forEach((item) => {
                    item.classList.remove("accordion__item--active")
                    item.style.maxHeight = `${item.querySelector(".accordion__item-title").clientHeight + 32}px`
                })
                el.classList.add("accordion__item--active")
                el.style.maxHeight = `${el.scrollHeight}px`
            }
        })
    })

    const accordion = document.querySelectorAll(".accordion")
    accordion.forEach((el) => {
        el.querySelector('.accordion__item').click()
    })

    const burger = document.querySelector(".burger")
    burger.addEventListener("click", () => {
        burger.classList.toggle("burger--active")
    })    
});


    const reviews = new Swiper('.reviews__content', {
        loop: true,
        pagination: {
        el: '.swiper-pagination',
        },
        navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        },
    });

    const stars = new Swiper('.stars__cards', {
        slidesPerView: 'auto',
    });
    const hero = new Swiper('.hero__content-mobile', {
        slidesPerView: 'auto',
    });